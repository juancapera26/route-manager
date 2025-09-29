// src/components/header/UserDropdown.tsx
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UserDropdown() {
  const {
    nombre,
    apellido,
    correo,
    role,
    documento,
    empresa,
    telefono,
    foto,
    logout,
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log("✅ Datos de usuario listos:", {
      nombre,
      apellido,
      correo,
      role,
      documento,
      empresa,
      telefono,
      foto,
    });
  }, [nombre, apellido, correo, role, documento, empresa, telefono, foto]);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const endpointPerfil =
    role === "1" ? "/admin/profile" : role === "2" ? "/driver/profile" : "/";

  // ✅ función que acepta null o undefined
  const getRoleName = (role: string | null | undefined) => {
    switch (role) {
      case "1":
        return "Admin";
      case "2":
        return "Conductor";
      default:
        return "Usuario";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-secondary dropdown-toggle dark:text-gray-400"
      >
        <span className="inline-block mr-2 font-medium text-theme-sm max-w-[150px] truncate text-gray-200">
          {nombre && apellido ? `${nombre} ${apellido}` : "Usuario"}
        </span>

        <span className="ml-2 text-xs text-gray-300">{getRoleName(role)}</span>

        <span className="ml-2 mr-2 overflow-hidden rounded-full h-11 w-11 flex-shrink-0">
          <img
            src={foto || "/default-avatar.png"}
            alt="User profile"
            className="w-full h-full object-cover"
          />
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block mr-1 font-medium text-theme-sm">
            {nombre && apellido ? `${nombre} ${apellido}` : "Usuario"}{" "}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {correo ?? "correo@ejemplo.com"}
          </span>
        </div>

        <ul className="mt-2 flex flex-col gap-1 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to={endpointPerfil}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Perfil
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="mailto:soporte@tudominio.com?subject=Necesito%20ayuda&body=Hola%2C%20necesito%20asistencia%20con..."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Soporte
            </DropdownItem>
          </li>
        </ul>

        <Link
          to="#"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          onClick={logout}
        >
          Cerrar sesión
        </Link>
      </Dropdown>
    </div>
  );
}
