import { useState, useRef, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchValue("");
  };

  // Cerrar al hacer click fuera en móvil
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Mobile: botón de icono con diseño moderno */}
      <button
        className="flex items-center justify-center w-10 h-10 text-gray-500 transition-all duration-200 rounded-lg lg:hidden hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        onClick={handleToggle}
        aria-label="Toggle Search"
      >
        <SearchIcon fontSize="small" />
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" />
      )}

      {/* Input responsivo con diseño moderno */}
      <div
        className={`
          absolute top-0 left-0 right-0 z-50 px-4 transition-all duration-300 ease-out
          ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5 pointer-events-none"
          }
          lg:static lg:opacity-100 lg:translate-y-0 lg:pointer-events-auto lg:px-0
        `}
      >
        <div className="relative flex items-center w-full max-w-xs sm:max-w-sm lg:max-w-md">
          {/* Contenedor del input con glassmorphism en móvil y background en desktop */}
          <div
            className="relative w-full 
    bg-white/95 backdrop-blur-sm rounded-xl shadow-theme-lg border border-gray-200/50
    lg:bg-gray-100 lg:backdrop-blur-none lg:rounded-lg lg:shadow-none lg:border-0
    dark:bg-gray-800 lg:dark:bg-gray-800"
          >
            {/* Icono de búsqueda */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 lg:left-3">
              <SearchIcon
                className="text-gray-400 dark:text-gray-500"
                fontSize="small"
              />
            </div>

            {/* Input field */}
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-10 pr-10 py-3 text-sm bg-transparent border-0 rounded-xl 
             placeholder-gray-500 text-gray-600
             focus:outline-none focus:ring-0 
             lg:py-2.5 lg:rounded-lg 
             lg:focus:ring-2 lg:focus:ring-brand-500 lg:focus:ring-offset-1
             dark:bg-gray-800 dark:text-gray-400 dark:placeholder-gray-400
             dark:focus:ring-offset-0
             "
            />

            {/* Botón limpiar (solo si hay texto) */}
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Botón cerrar para móvil */}
          <button
            onClick={handleClose}
            className="ml-3 flex items-center justify-center w-10 h-10 text-gray-500 bg-white/95 backdrop-blur-sm rounded-full shadow-theme-md border border-gray-200/50 hover:bg-gray-50 lg:hidden dark:bg-gray-900/95 dark:border-gray-700/50 dark:hover:bg-gray-800"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
