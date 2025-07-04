import { useState } from "react";
import useAuth from "../../../hooks/useAuth";

const ResetPasswordRequestHook = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false);
  const { handlePasswordReset } = useAuth(); // Asegúrate de tener este método en tu hook de autenticación

  
  const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
  
      try {
        await handlePasswordReset(email, setError, setMessage);
        alert("Check your inbox for password reset instructions.");
      } catch (err) {
        setError("Failed to send reset email.");
      } finally {
        setLoading(false);
      }
    };

  return {
    error,
    message,
    email,
    loading,
    handleResetPassword,
    setEmail,
    setLoading
  }
}

export default ResetPasswordRequestHook
