import type React from "react";
import type { FC } from "react";
// 🚨 Importar las propiedades HTML nativas
import type { InputHTMLAttributes } from "react"; 

// 🚨 MODIFICACIÓN CLAVE: Extender InputHTMLAttributes
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Las propiedades aquí abajo (type, id, name, etc.) ya están cubiertas por la extensión, 
  // pero las dejo para visibilidad o si tienen tipos más estrictos.
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string; // (Ya cubierto por la extensión)
  max?: string; // (Ya cubierto por la extensión)
  step?: number; // (Ya cubierto por la extensión)
  disabled?: boolean; // (Ya cubierto por la extensión)
  // Propiedades personalizadas o de estado:
  success?: boolean;
  error?: boolean;
  hint?: string;
  required?: boolean; // (Ya cubierto por la extensión)
  data_field?: string;
  onClick?: (e:React.MouseEvent<HTMLInputElement>) => void // (Ya cubierto por la extensión)
  
  // Nota: Si usas 'max' para la longitud, quita 'max' de aquí ya que es para números/fechas.
  // Sin embargo, la extensión ya cubre 'maxLength', 'min', 'max' y todo lo demás.
}

// 🚨 Asegúrate de desestructurar y capturar todas las demás propiedades (...rest)
const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  required,
  data_field,
  onClick,
  // 🚨 Propiedades restantes que no desestructuramos (como maxLength)
  ...rest 
}) => {
  let inputClasses = ` h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
  } else if (error) {
    inputClasses += `  border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
  }

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        data-field={data_field}
        disabled={disabled}
        required={required}
        className={inputClasses}
        onClick={onClick}
        // 🚨 CAMBIO CLAVE: Pasar todas las demás propiedades aquí
        {...rest} 
      />

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;