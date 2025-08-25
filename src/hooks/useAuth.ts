import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdTokenResult,
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
  tipoVehiculo: string; // Será el enum de tu MySQL
}

const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [user, setUser] = useState<User | null>(null); 
  const [role, setRole] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [apellido, setApellido] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await getIdTokenResult(firebaseUser);
          console.log("🔥 TOKEN CLAIMS:", token.claims);

          setRole((token.claims.role as string) || null);
          setNombre((token.claims.nombre as string) || null);
          setApellido((token.claims.apellido as string) || null);
        } catch (err) {
          console.error("❌ Error al obtener claims:", err);
          setRole(null);
          setNombre(null);
          setApellido(null);
        }
      } else {
        setRole(null);
        setNombre(null);
        setApellido(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    await signOut(auth);
    navigate("/signin");
  }, [navigate]);

  const resetIdleTimer = useCallback(() => {
    if (!user) return;

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      toast.info("Sesión cerrada por inactividad.");
      logout();
    }, 10 * 60 * 1000); // 10 minutos
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const tokenResult = await getIdTokenResult(userCredential.user);

      const rawRole = tokenResult.claims.role;
      setRole(typeof rawRole === "string" ? rawRole : null);

      setNombre((tokenResult.claims.nombre as string) || null);
      setApellido((tokenResult.claims.apellido as string) || null);

      if (tokenResult.claims.role === "1") {
        navigate("/admin");
      } else if (tokenResult.claims.role === "2") {
        navigate("/home");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      // No ponemos setLoading(false) aquí, porque el onAuthStateChanged ya lo hará
    }
  };

  // NUEVA FUNCIÓN: Manejar registro de usuarios
  const handleRegister = async (
    registerData: RegisterData,
    setError: React.Dispatch<React.SetStateAction<string>>,
    setSuccess?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setError("");
    setLoading(true);

    try {
      // Validaciones del frontend antes de enviar
      if (registerData.email !== registerData.confirmarEmail) {
        throw new Error("Los emails no coinciden");
      }

      if (registerData.password !== registerData.repetirPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      if (registerData.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      // Obtener la URL base del backend desde variables de entorno o configuración
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      // Llamada al backend para crear el usuario
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: registerData.nombre,
          apellido: registerData.apellido,
          documento: registerData.documento,
          numeroTelefono: registerData.numeroTelefono,
          email: registerData.email,
          password: registerData.password,
          tipoVehiculo: registerData.tipoVehiculo,
          // El rol siempre será "2" para conductores según tus especificaciones
          role: "2"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores específicos del backend
        throw new Error(data.message || 'Error en el registro');
      }

      // Registro exitoso
      if (setSuccess) {
        setSuccess("Usuario registrado exitosamente. Ya puedes iniciar sesión.");
      } else {
        toast.success("Usuario registrado exitosamente. Ya puedes iniciar sesión.");
      }

      // Redirigir al login después de registro exitoso
      navigate("/signin");

    } catch (err) {
      console.error("❌ Error en el registro:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

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
    if (user) {
      const token = await user.getIdToken();
      return token;
    }
    return null;
  };

  return {
    authLoading: loading,
    handleLogin,
    handleRegister, // ✅ Nueva función exportada
    logout,
    handlePasswordReset,
    getAccessToken,
    user,
    role,
    nombre,
    apellido,
    isAuthenticated: !!user,
  };
};

export default useAuth;