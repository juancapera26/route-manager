import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Additional classes
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  // Size Classes - Mejorado con mejor padding y altura
  const sizeClasses = {
    sm: "px-4 py-2.5 text-sm font-medium min-h-[36px]",
    md: "px-6 py-3 text-sm font-medium min-h-[42px]",
  };

  // Variant Classes - Mejorado con mejores colores y estados
  const variantClasses = {
    primary:
      "bg-brand-500 text-white border border-brand-500 shadow-sm hover:bg-brand-600 hover:border-brand-600 active:bg-brand-700 focus:ring-2 focus:ring-brand-500/20 focus:ring-offset-2 disabled:bg-brand-300 disabled:border-brand-300 disabled:text-white/80",
    outline:
      "bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 focus:ring-2 focus:ring-gray-500/20 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 dark:active:bg-gray-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 dark:disabled:bg-gray-900 dark:disabled:text-gray-600 dark:disabled:border-gray-700",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2.5 rounded-lg
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-offset-white dark:focus:ring-offset-gray-900
        font-medium tracking-tight
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? "cursor-not-allowed transform-none" : "hover:scale-[1.02] active:scale-[0.98]"}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {startIcon && (
        <span className={`flex items-center justify-center ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
          {startIcon}
        </span>
      )}
      <span className="flex items-center">{children}</span>
      {endIcon && (
        <span className={`flex items-center justify-center ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
          {endIcon}
        </span>
      )}
    </button>
  );
};

export default Button;