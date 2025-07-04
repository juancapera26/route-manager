import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { auth } from "../firebase/firebaseConfig";

const ResetPasswordFormHook = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const oobCode = params.get("oobCode");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    if (oobCode) {
      verifyPasswordResetCode(auth, oobCode)
        .then(() => {
          setVerified(true);
        })
        .catch(() => {
          setMessage("El enlace no es válido o ha expirado.");
        });
    }
  }, [oobCode]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oobCode) return;
    if(newPassword !== newPasswordConfirm){
      setMessage("The passwords do not match.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Password updated successfully. You can now log in.");
      setVerified(false);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: any) {
      setMessage("Error changing password: " + error.message);
    }
    setLoading(false);
  };

  return {
    verified,
    newPassword,
    message,
    loading,
    newPasswordConfirm,
    showPassword,
    showPasswordConfirm,
    setShowPasswordConfirm,
    setShowPassword,
    handleReset,
    setNewPassword,
    setNewPasswordConfirm}
}

export default ResetPasswordFormHook
