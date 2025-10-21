// src/components/header/NotificationDropdown.tsx
/*
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router";
import {
  notificacionesMock,
  estilosNotificacion,
  type Notificacion,
  type TipoNotificacion,
} from "../../global/dataMock";

// Componente para renderizar iconos según el tipo
const IconoNotificacion = ({ tipo }: { tipo: TipoNotificacion }) => {
  const iconos = {
    informacion: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 9V13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    advertencia: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86ZM12 9V13M12 17H12.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    completado: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M20 6L9 17L4 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  };

  return iconos[tipo];
};

// Función para formatear tiempo relativo
const formatearTiempoRelativo = (fechaISO: string): string => {
  const ahora = new Date();
  const fechaNotificacion = new Date(fechaISO);
  const diferenciaMs = ahora.getTime() - fechaNotificacion.getTime();

  const minutos = Math.floor(diferenciaMs / (1000 * 60));
  const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
  const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

  if (minutos < 60) return `${minutos} min`;
  if (horas < 24) return `${horas}h`;
  return `${dias}d`;
};

// Componente para renderizar una notificación individual
const ElementoNotificacion = ({
  notificacion,
  onClick,
}: {
  notificacion: Notificacion;
  onClick: () => void;
}) => {
  const estilos = estilosNotificacion[notificacion.tipo];

  return (
    <DropdownItem
      onItemClick={onClick}
      className={`
        flex gap-3 rounded-xl border-b border-gray-50 p-3 px-4 py-3 transition-all duration-200 
        hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5
        ${!notificacion.leida ? "bg-blue-50/30 dark:bg-blue-900/10" : ""}
      `}
    >
      {/* Icono con estado visual 
      <div
        className={`relative w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${estilos.bgIcon}`}
      >
        <div className={estilos.textIcon}>
          <IconoNotificacion tipo={notificacion.tipo} />
        </div>
        {!notificacion.leida && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        )}
      </div>
      

      {/* Contenido de la notificación
      <div className="flex-1 min-w-0">
        <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-900 dark:text-white">
            {notificacion.titulo}
          </span>
        </p>

        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {notificacion.descripcion}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${estilos.bgBadge} ${estilos.textBadge}`}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
              <circle cx="4" cy="4" r="4" />
            </svg>
            {notificacion.tipo}
          </span>
          <span className="text-gray-400">•</span>
          <span>{formatearTiempoRelativo(notificacion.fechaCreacion)}</span>
        </div>
      </div>
    </DropdownItem>
  );
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState(notificacionesMock);

  // Calcular notificaciones no leídas
  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;
  const hayNotificaciones = notificaciones.length > 0;

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleNotificationClick = (notificacionId: string) => {
    // Marcar como leída
    setNotificaciones((prev) =>
      prev.map((notif) =>
        notif.id === notificacionId ? { ...notif, leida: true } : notif
      )
    );
    closeDropdown();
  };

  return (
    <div className="relative">
    
      {/* Botón de notificaciones*
      <button
        className="relative flex items-center justify-center text-gray-500 transition-all duration-200 rounded-lg h-10 w-10 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        onClick={toggleDropdown}
        aria-label="Notificaciones"
      > 
        {/* Indicador de notificaciones no leídas *
        {notificacionesNoLeidas > 0 && (
          <span className="absolute -right-1 -top-1 z-10 min-w-[20px] h-5 px-1 flex items-center justify-center text-xs font-medium text-white bg-orange-500 rounded-full">
            {notificacionesNoLeidas > 99 ? "99+" : notificacionesNoLeidas}
            <span className="absolute inline-flex w-full h-full bg-orange-500 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
          

        {/* Icono de campana *
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
      

      {/* Dropdown *
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute mt-3 flex h-[480px] flex-col rounded-2xl border border-gray-200 bg-white shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-50
          right-1/2 translate-x-1/2 w-[calc(100vw-2rem)] max-w-[350px]
          sm:right-0 sm:translate-x-0 sm:w-[380px] sm:max-w-none
        "
      >
         
        {/* Header *
        <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Notificaciones
            </h5>
            {notificacionesNoLeidas > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-medium text-white bg-orange-500 rounded-full">
                {notificacionesNoLeidas}
              </span>
            )}
          </div>

          <button
            onClick={closeDropdown}
            className="flex items-center justify-center w-8 h-8 text-gray-500 transition-colors duration-200 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
            aria-label="Cerrar notificaciones"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 24 24"
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

        

        {/* Lista *
        <div className="flex-1 overflow-y-auto px-2">
          {hayNotificaciones ? (
            <ul className="space-y-1 py-2">
              {notificaciones.map((notificacion) => (
                <li key={notificacion.id}>
                  <ElementoNotificacion
                    notificacion={notificacion}
                    onClick={() => handleNotificationClick(notificacion.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            // Estado vacío
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400"
                >
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
            </div>
          )}
        </div>
        

        {/* Footer *
        {hayNotificaciones && (
          <div className="p-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Link
              to="/admin/updates"
              onClick={closeDropdown}
              className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-600"
            >
              Ver todas las notificaciones
            </Link>
          </div>
        )}
      </Dropdown>
    </div>
  );
}*/

