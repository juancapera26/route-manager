import ResetPasswordFormHook from "../../hooks/ResetPasswordFormHook";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../../icons";

const ResetPasswordFormContent = () => {
  const { 
    verified,
    newPassword,
    newPasswordConfirm,
    message,
    loading,
    showPassword,
    showPasswordConfirm,
    setShowPassword,
    setShowPasswordConfirm,
    handleReset,
    setNewPassword,
    setNewPasswordConfirm
  } = ResetPasswordFormHook();
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Restablecer contraseña</h1>
        {message && <p className="mb-4 text-red-500">{message}</p>}
        {verified && (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
            </span>
            </div>
            <div className="relative">
              <Input
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />
              <span onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                {showPasswordConfirm ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
            </span>
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? "Cambiando..." : "Cambiar contraseña"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordFormContent
