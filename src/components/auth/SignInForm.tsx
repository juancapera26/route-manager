/**
2. src/components/auth/SignInForm.tsx
Este es el formulario de inicio de sesión. Su propósito es manejar la interfaz y la interacción del usuario.

import useLoginHook from "./hooks/LoginHook";: Esta línea es clave. El componente no tiene su propia lógica de estado (por ejemplo, el valor del email o la contraseña). En su lugar, usa un custom hook llamado useLoginHook.

const { ... } = useLoginHook();: Aquí, el componente llama al hook y extrae todas las variables de estado (email, password, error) y las funciones (setEmail, setPassword, handleLogin) que necesita para funcionar.

onChange={(e) => setEmail(e.target.value)}: Cuando el usuario escribe en el campo de email, esta línea llama a la función setEmail que viene del hook, actualizando el estado del email.

onSubmit={(e) => handleLogin(e, email, password, setError)}: Cuando el usuario hace clic en el botón de "Sign In", se llama a la función handleLogin que también viene del hook. Esta función es la que se encarga de la lógica de autenticación. */

import { Link } from "react-router";
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
                    name="email"
                    data-testid="input-email"
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
                      type="password"
                      name="password"
                      data-testid="input-password"
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
                {error && <div style={{ color: "red" }}>{error}</div>}
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
                    Olvido su contraseña?
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

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                ¿No tienes una cuenta? {""}
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
