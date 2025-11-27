import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Select from "../form/Select";
import useAuth, { type RegisterData } from "../../hooks/useAuth";

export default function SignUpForm() {
  const { handleRegister, authLoading } = useAuth();

  // Estados para la UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Estado para el formulario completo
  const [formData, setFormData] = useState<RegisterData>({
    nombre: "",
    apellido: "",
    documento: "",
    numeroTelefono: "",
    email: "",
    confirmarEmail: "",
    password: "",
    repetirPassword: "",
    tipoVehiculo: "",
  });

  // Opciones del tipo de vehículo (sin la opción vacía inicial)
  const tiposVehiculo = [
    { value: "camion", label: "Camión" },
    { value: "furgon", label: "Furgón" },
    { value: "moto", label: "Moto" },
    { value: "camioneta", label: "Camioneta" },
  ];

  // Manejar cambios en los inputs normales
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambio específico del Select (tipo de vehículo)
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      tipoVehiculo: value,
    }));
  };
  const allowedDomains = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
  ];

  const isValidEmailDomain = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    const domain = email.split("@")[1];
    return allowedDomains.includes(domain.toLowerCase());
  };

  // Validaciones del frontend
  const validateForm = (): string | null => {
    if (!formData.nombre.trim()) return "El nombre es requerido";
    if (!formData.apellido.trim()) return "El apellido es requerido";
    if (!formData.documento.trim()) return "El documento es requerido";
    if (!formData.numeroTelefono.trim())
      return "El número de teléfono es requerido";

    if (!formData.email.trim()) return "El email es requerido";
    if (!formData.confirmarEmail.trim()) return "Confirmar email es requerido";

    if (formData.email !== formData.confirmarEmail)
      return "Los emails no coinciden";

    // ⬇️ ⬇️ NUEVO: Validar dominio permitido
    if (!isValidEmailDomain(formData.email))
      return "El correo debe ser de un proveedor válido (gmail, outlook, hotmail, yahoo).";

    if (!formData.password) return "La contraseña es requerida";

    if (formData.password.length < 6)
      return "La contraseña debe tener al menos 6 caracteres";

    if (formData.password !== formData.repetirPassword)
      return "Las contraseñas no coinciden";

    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    if (!hasSpecialChar)
      return "La contraseña debe contener al menos un carácter especial";

    if (!isChecked) return "Debe aceptar los términos y condiciones";

    return null;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar mensajes anteriores
    setError("");
    setSuccess("");

    // Validar formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Enviar datos al backend
    await handleRegister(formData, setError, undefined, (msg) => {
      navigate("/signin", { state: { successMessage: msg } });
    });
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Volver al inicio
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Registrarse
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete los datos para registrarse como conductor
            </p>
          </div>

          {/* Mensajes de error y éxito */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              {success}
            </div>
          )}

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Nombres */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <Label>
                      Nombre<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu nombre"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Apellido<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu apellido"
                    />
                  </div>
                </div>

                {/* Documento y Teléfono */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <Label>
                      Documento<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="documento"
                      name="documento"
                      value={formData.documento}
                      onChange={handleInputChange}
                      placeholder="Ej: 12345678"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Teléfono<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="tel"
                      id="numeroTelefono"
                      name="numeroTelefono"
                      value={formData.numeroTelefono}
                      onChange={handleInputChange}
                      placeholder="Ej: 3001234567"
                    />
                  </div>
                </div>

                {/* Emails */}
                <div>
                  <Label>
                    Correo<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu correo"
                  />
                </div>

                <div>
                  <Label>
                    Confirmar Correo<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="confirmarEmail"
                    name="confirmarEmail"
                    value={formData.confirmarEmail}
                    onChange={handleInputChange}
                    placeholder="Confirma tu correo"
                  />
                </div>

                {/* Contraseñas */}
                <div>
                  <Label>
                    Contraseña<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Ingresa tu contraseña"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
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

                <div>
                  <Label>
                    Repetir Contraseña<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Repite tu contraseña"
                      type={showConfirmPassword ? "text" : "password"}
                      id="repetirPassword"
                      name="repetirPassword"
                      value={formData.repetirPassword}
                      onChange={handleInputChange}
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* Tipo de Vehículo */}
                <div>
                  <Label>Tipo de Vehículo (Opcional)</Label>
                  <Select
                    placeholder="Selecciona un tipo de vehículo"
                    defaultValue={formData.tipoVehiculo}
                    onChange={handleSelectChange}
                    options={tiposVehiculo.slice(0)} // Quitamos la primera opción vacía ya que el placeholder la maneja
                  />
                </div>

                {/* Checkbox de términos */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    className="w-5 h-5 mt-0.5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block text-sm font-normal text-gray-500 dark:text-gray-400">
                    Al crear una cuenta acepto los{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Términos y Condiciones
                    </span>{" "}
                    y la{" "}
                    <span className="text-gray-800 dark:text-white">
                      Política de Privacidad
                    </span>
                  </p>
                </div>

                {/* Botón de envío */}
                <div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {authLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Registrando...
                      </>
                    ) : (
                      "Registrarse"
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5 mb-4">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
