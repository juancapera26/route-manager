import { Link } from "react-router";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import ResetPasswordRequestHook from "./hooks/ResetPasswordRequestHook";

const ResetPasswordRequest = () => {
  const { email, error, message, loading, handleResetPassword, setEmail } =
    ResetPasswordRequestHook();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Recuperar Contraseña
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Introduzca su correo para recibir un enlace para restablecer su contraseña.
            </p>
          </div>
          <div>
            <form onSubmit={handleResetPassword}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Correo <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="info@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {message && <div style={{ color: "green" }}>{message}</div>}
                {error && <div style={{ color: "red" }}>{error}</div>}
                <div>
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    size="sm"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Enviar código de recuperación"}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                ¿Ya recuerda su contraseña?{" "}
                <Link
                  to="/signin"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-500"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
