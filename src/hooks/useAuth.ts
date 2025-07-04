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

const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estado local para usuario, para que el hook sea reactivo a cambios de auth
  const [user, setUser] = useState<User | null>(auth.currentUser);

  // Escuchar cambios en el usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // actualizamos el estado con el usuario actual o null
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
    if (!user) return; // si no hay usuario, no inicia timer

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    idleTimerRef.current = setTimeout(() => {
      toast.info("Session expired due to inactivity.");
      logout();
    }, 10 * 60 * 1000);
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
      await userCredential.user.getIdToken();
      navigate("/");
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
      setMessage("We've sent you a link to reset your password.");
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
    isAuthenticated: !!user,
  };
};

export default useAuth;
