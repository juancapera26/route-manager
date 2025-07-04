import type React from "react";
import { Link } from "react-router";

interface DropdownItemProps {
  tag?: "a" | "button";
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  onItemClick?: () => void;
  baseClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  tag = "button",
  to,
  href,
  target,
  rel,
  onClick,
  onItemClick,
  baseClassName = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  className = "",
  children,
}) => {
  const combinedClasses = `${baseClassName} ${className}`.trim();

  const handleClick = (event: React.MouseEvent) => {
    if (tag === "button") {
      event.preventDefault();
    }
    if (onClick) onClick();
    if (onItemClick) onItemClick();
  };

  if (tag === "a") {
    // Si viene `to` => usar React Router <Link />
    if (to) {
      return (
        <Link to={to} className={combinedClasses} onClick={handleClick}>
          {children}
        </Link>
      );
    }

    // Si viene `href` => usar <a />
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClasses}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  // Botón por defecto
  return (
    <button onClick={handleClick} className={combinedClasses}>
      {children}
    </button>
  );
};
