// src/hooks/useAuth.ts
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { auth } from "../firebase/firebaseConfig";

// Tipos para el registro
export interface RegisterData {
  nombre: string;
  apellido: string;
  documento: string;
  numeroTelefono: string;
  email: string;
  confirmarEmail: string;
  password: string;
  repetirPassword: string;
  tipoVehiculo: string;
}

const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [user, setUser] = useState<User | null>(null);

  // Datos del usuario desde backend
  const [role, setRole] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [apellido, setApellido] = useState<string | null>(null);
  const [correo, setCorreo] = useState<string | null>(null);
  const [telefono, setTelefono] = useState<string | null>(null);
  const [documento, setDocumento] = useState<string | null>(null);
  const [tipoDocumento, setTipoDocumento] = useState<string | null>(null);
  const [empresa, setEmpresa] = useState<string | null>(null);

  // ✅ Detectar login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();

          // 🔍 pedir datos al backend cada vez que se monta la sesión
          const API_BASE_URL =
            import.meta.env.VITE_API_URL || "http://localhost:3000";
          const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const userData = data.data;

            setRole(userData.role?.toString() || null);
            setNombre(userData.nombre || null);
            setApellido(userData.apellido || null);
            setCorreo(userData.correo || firebaseUser.email || null);
            setTelefono(userData.telefono_movil || null);
            setDocumento(userData.documento || null);
            setTipoDocumento(userData.tipo_documento || null);
            setEmpresa(userData.empresa || null);
          } else {
            console.error("❌ Backend no validó al usuario");
          }
        } catch (err) {
          console.error("❌ Error al obtener datos del backend:", err);
        }
      } else {
        setRole(null);
        setNombre(null);
        setApellido(null);
        setCorreo(null);
        setDocumento(null);
        setEmpresa(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Logout
  const logout = useCallback(async () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    await signOut(auth);
    navigate("/signin");
  }, [navigate]);

  // ✅ Timer de inactividad
  const resetIdleTimer = useCallback(() => {
    if (!user) return;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      toast.info("Sesión cerrada por inactividad.");
      logout();
    }, 10 * 60 * 1000); // 10 min
  }, [logout, user]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    const handleUserActivity = () => resetIdleTimer();

    events.forEach((event) =>
      window.addEventListener(event, handleUserActivity)
    );
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((event) =>
        window.removeEventListener(event, handleUserActivity)
      );
    };
  }, [resetIdleTimer]);

  // ✅ LOGIN
  const handleLogin = async (
    e: { preventDefault: () => void },
    email: string,
    password: string,
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Login en Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ userCredential (Firebase):", userCredential.user);

      // 2. Obtener token de Firebase
      const token = await userCredential.user.getIdToken();

      // 3. Validar contra backend (fuente de verdad)
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Usuario no válido en la base de datos");
      }

      const data = await response.json();
      console.log("✅ Data desde backend (Prisma):", data);

      if (!data.success) {
        throw new Error(
          data.message || "Usuario no válido en la base de datos"
        );
      }

      // 4. Guardar datos confiables desde backend
      const userData = data.data;
      setRole(userData.role?.toString() || null);
      setNombre(userData.nombre || null);
      setApellido(userData.apellido || null);
      setCorreo(userData.correo || null);
      setTelefono(userData.telefono_movil || null);
      setDocumento(userData.documento || null);
      setTipoDocumento(userData.tipo_documento || null);
      setEmpresa(userData.empresa || null);

      // 5. Redirección por rol
      if (userData.role === 1 || userData.role === "1") {
        navigate("/admin");
      } else if (userData.role === 2 || userData.role === "2") {
        navigate("/driver");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ REGISTRO
  const handleRegister = async (
    registerData: RegisterData,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setSuccess?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setError("");
    setLoading(true);

    try {
      if (registerData.email !== registerData.confirmarEmail) {
        throw new Error("Los emails no coinciden");
      }
      if (registerData.password !== registerData.repetirPassword) {
        throw new Error("Las contraseñas no coinciden");
      }
      if (registerData.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      const payload = {
        email: registerData.email,
        password: registerData.password,
        role: "2",
        isPublicRegistration: true,
        nombre: registerData.nombre,
        apellido: registerData.apellido,
        telefono_movil: registerData.numeroTelefono,
        id_empresa: "1",
        tipo_documento: "CC",
        documento: registerData.documento,
      };

      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000";

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Error en el registro");
      }

      if (setSuccess) {
        setSuccess(
          "Usuario registrado exitosamente. Ya puedes iniciar sesión."
        );
      } else {
        toast.success(
          "Usuario registrado exitosamente. Ya puedes iniciar sesión."
        );
      }

      navigate("/signin");
    } catch (err) {
      console.error("❌ Error en el registro:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESET PASSWORD
  const handlePasswordReset = async (
    email: string,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setMessage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Hemos enviado un enlace para restablecer la contraseña.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getAccessToken = async () => {
    if (user) return user.getIdToken();
    return null;
  };

  return {
    authLoading: loading,
    handleLogin,
    handleRegister,
    logout,
    handlePasswordReset,
    getAccessToken,
    user,

    // datos del backend
    role,
    nombre,
    apellido,
    correo,
    telefono,
    documento,
    tipoDocumento,
    empresa,

    isAuthenticated: !!user,
  };
};

export default useAuth;
