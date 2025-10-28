import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import useLoginHook from "./hooks/LoginHook";

export default function SignInForm() {
  const {
    email,
    password,
    error,
    showPassword,
    isChecked,
    setPassword,
    setShowPassword,
    setIsChecked,
    setEmail,
    setError,
    handleLogin,
  } = useLoginHook();

  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);

      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 8080);

      return () => clearTimeout(timer); // limpiar timeout si el compo se desmonta
    }
  }, [location.state]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tu correo y contraseña para iniciar sesión
            </p>
          </div>
          <div>
            <form onSubmit={(e) => handleLogin(e, email, password, setError)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Correo <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    type="email"
                    placeholder="info@gmail.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Contraseña <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Error de login */}
                {error && <div className="text-red-600">{error}</div>}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Mantenerme conectado
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-blue-600 hover:text-blue-600 dark:text-blue-400"
                  >
                    ¿Olvidó su contraseña?
                  </Link>
                </div>

                <div>
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-700"
                    size="sm"
                  >
                    Iniciar sesión
                  </Button>
                </div>
              </div>
            </form>

            {successMessage && (
              <div className="mt-4 text-center text-green-600 font-medium">
                {successMessage}
              </div>
            )}

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                ¿No tienes una cuenta?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-600 dark:text-blue-400"
                >
                  Registrarse
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
