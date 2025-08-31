import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };

  return (
    <div className="relative">
      {/* Botón de notificaciones sin background */}
      <button
        className="relative flex items-center justify-center text-gray-500 transition-all duration-200 rounded-lg h-10 w-10 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        onClick={handleClick}
        aria-label="Notifications"
      >
        {/* Indicador de notificación activa */}
        <span
          className={`absolute -right-1 -top-1 z-10 h-2.5 w-2.5 rounded-full bg-orange-500 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-500 rounded-full opacity-75 animate-ping"></span>
        </span>

        {/* Icono de campana */}
        <svg
          className="fill-current transition-transform duration-200 hover:scale-110"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Dropdown responsive */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className={`
          absolute mt-3 flex h-[480px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark
          right-0 w-[calc(100vw-2rem)] max-w-[350px]
          sm:w-[361px] sm:max-w-[361px]
          lg:right-0
        `}
      >
        {/* Header del dropdown */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notificaciones
            </h5>
            {notifying && (
              <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-orange-500 rounded-full">
                3
              </span>
            )}
          </div>
          
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Lista de notificaciones con scroll personalizado */}
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar space-y-1">
          {/* Notificación 1 */}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-xl border-b border-gray-50 p-3 px-4 py-3 transition-all duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="relative block w-10 h-10 rounded-full flex-shrink-0">
                <img
                  width={40}
                  height={40}
                  src="/images/user/user-02.jpg"
                  alt="User"
                  className="w-full h-full object-cover rounded-full"
                />
                <span className="absolute bottom-0 right-0 z-10 h-2.5 w-2.5 rounded-full border-2 border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <div className="flex-1 min-w-0">
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Terry Franci
                  </span>
                  {" "}requests permission to change{" "}
                  <span className="font-medium text-brand-600 dark:text-brand-400">
                    Project - Nganter App
                  </span>
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-light-50 text-blue-light-700 rounded-full dark:bg-blue-light-900/20 dark:text-blue-light-400">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                      <circle cx="4" cy="4" r="4"/>
                    </svg>
                    Project
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>5 min ago</span>
                </div>
              </div>
            </DropdownItem>
          </li>

          {/* Notificación 2 */}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-xl border-b border-gray-50 p-3 px-4 py-3 transition-all duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="relative block w-10 h-10 rounded-full flex-shrink-0 bg-orange-100 flex items-center justify-center dark:bg-orange-900/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-orange-600 dark:text-orange-400">
                  <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </span>

              <div className="flex-1 min-w-0">
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
                  Tu proyecto{" "}
                  <span className="font-medium text-brand-600 dark:text-brand-400">
                    Dashboard v2.0
                  </span>
                  {" "}ha recibido una nueva estrella
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full dark:bg-orange-900/20 dark:text-orange-400">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                      <circle cx="4" cy="4" r="4"/>
                    </svg>
                    Achievement
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>1 hour ago</span>
                </div>
              </div>
            </DropdownItem>
          </li>

          {/* Notificación 3 */}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-xl border-b border-gray-50 p-3 px-4 py-3 transition-all duration-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
            >
              <span className="relative block w-10 h-10 rounded-full flex-shrink-0 bg-success-100 flex items-center justify-center dark:bg-success-900/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-success-600 dark:text-success-400">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>

              <div className="flex-1 min-w-0">
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
                  Task completada:{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    Update user authentication
                  </span>
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success-50 text-success-700 rounded-full dark:bg-success-900/20 dark:text-success-400">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                      <circle cx="4" cy="4" r="4"/>
                    </svg>
                    Task
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>2 hours ago</span>
                </div>
              </div>
            </DropdownItem>
          </li>

          {/* Estado vacío (cuando no hay notificaciones) */}
          {false && (
            <li className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path
                    d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.73 21a2 2 0 0 1-3.46 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                No hay notificaciones
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Te notificaremos cuando algo importante suceda
              </p>
            </li>
          )}
        </ul>

        {/* Footer del dropdown */}
        <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700">
          <Link
            to="/notifications"
            onClick={closeDropdown}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-600"
          >
            Ver todas las notificaciones
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}
