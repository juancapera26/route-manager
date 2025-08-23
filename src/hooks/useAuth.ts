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

const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [role, setRole] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [apellido, setApellido] = useState<string | null>(null);
  const [correo, setCorreo] = useState<string | null>(null); // 👈 Nuevo

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const token = await getIdTokenResult(firebaseUser);
          console.log("🔥 TOKEN CLAIMS:", token.claims);

          setRole((token.claims.role as string) || null);

          const fullName = token.claims.name as string | undefined;
          if (fullName) {
            const partes = fullName.split(" ");
            setNombre(partes[0] || null);
            setApellido(partes.slice(1).join(" ") || null);
          } else {
            setNombre(null);
            setApellido(null);
          }

          setCorreo(firebaseUser.email || null); // 👈 Guardamos correo
        } catch (err) {
          console.error("❌ Error al obtener claims:", err);
          setRole(null);
          setNombre(null);
          setApellido(null);
          setCorreo(null);
        }
      } else {
        setRole(null);
        setNombre(null);
        setApellido(null);
        setCorreo(null);
      }
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

      const fullName = tokenResult.claims.name as string | undefined;
      if (fullName) {
        const partes = fullName.split(" ");
        setNombre(partes[0] || null);
        setApellido(partes.slice(1).join(" ") || null);
      } else {
        setNombre(null);
        setApellido(null);
      }

      setCorreo(userCredential.user.email || null); // 👈 Guardamos correo

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
    loading,
    handleLogin,
    logout,
    handlePasswordReset,
    getAccessToken,
    user,
    role,
    nombre,
    apellido,
    correo, // 👈 lo devolvemos
    isAuthenticated: !!user,
  };
};

export default useAuth;
