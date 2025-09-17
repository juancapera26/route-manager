// src/components/common/EstadoFilterDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { OpcionesFiltro } from "../../hooks/useEstadoFilter";

interface EstadoFilterDropdownProps<T> {
  opciones: OpcionesFiltro<T>;
  valorSeleccionado: T | null;
  onCambio: (valor: T | null) => void;
  contadores?: { [key: string]: number };
  className?: string;
}

function EstadoFilterDropdown<T>({
  opciones,
  valorSeleccionado,
  onCambio,
  contadores,
  className = "",
}: EstadoFilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ CORREGIDO: Función para obtener contador con lógica mejorada
  const obtenerContador = (valor: T | null): number => {
    if (!contadores) return 0;
    
    // Si valor es null (opción "Todos"), buscar con key "todos"
    if (valor === null) {
      return contadores["todos"] || 0;
    }
    
    // Para valores específicos, usar el valor como string
    const key = String(valor);
    return contadores[key] || 0;
  };

  const opcionSeleccionada =
    opciones.find((op) => op.valor === valorSeleccionado) || opciones[0];
  const contadorSeleccionado = obtenerContador(valorSeleccionado);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Texto "Filtrar por:" separado */}
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
        Filtrar por:
      </span>

      {/* Dropdown container */}
      <div className="relative" ref={dropdownRef}>
        {/* Botón principal - más compacto */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            inline-flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium 
            bg-white border border-gray-300 rounded-lg shadow-sm 
            hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 dark:hover:border-gray-500
            transition-all duration-200 ease-in-out
            min-w-[140px] max-w-[200px]
          `}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-medium text-gray-900 dark:text-white truncate">
              {opcionSeleccionada.etiqueta}
            </span>
            {/* ✅ CORREGIDO: Mostrar contador siempre cuando exista */}
            {contadores && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-5 px-1.5 text-xs font-semibold bg-brand-100 text-brand-700 rounded-full dark:bg-brand-900/30 dark:text-brand-400 flex-shrink-0">
                {contadorSeleccionado}
              </span>
            )}
          </div>

          <svg
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown menu - mejorado */}
        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
            <div className="py-1">
              {opciones.map((opcion, index) => {
                const contador = obtenerContador(opcion.valor);
                const esActivo = valorSeleccionado === opcion.valor;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      onCambio(opcion.valor);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm flex items-center justify-between 
                      transition-all duration-150 ease-in-out
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      ${
                        esActivo
                          ? "bg-brand-50 text-brand-700 border-l-2 border-brand-500 dark:bg-brand-900/20 dark:text-brand-400 dark:border-brand-500"
                          : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }
                    `}
                  >
                    <span className="font-medium">{opcion.etiqueta}</span>
                    {contadores && (
                      <span
                        className={`
                        inline-flex items-center justify-center min-w-[18px] h-5 px-1.5 text-xs font-semibold rounded-full
                        ${
                          esActivo
                            ? "bg-brand-200 text-brand-800 dark:bg-brand-800/50 dark:text-brand-300"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                        }
                      `}
                      >
                        {contador}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EstadoFilterDropdown;