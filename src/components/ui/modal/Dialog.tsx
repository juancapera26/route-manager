import { useEffect, useRef } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string; // ✅ Puedes pasar max-w-* o w-* aquí
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  className = "",
  children,
  showCloseButton = true,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Fondo oscurecido */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Contenedor del diálogo */}
      <div
        ref={dialogRef}
        className={`relative z-50 w-full rounded-xl bg-white shadow-2xl dark:bg-gray-800 transition-all duration-300 transform animate-in fade-in-0 zoom-in-95 p-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
            aria-label="Cerrar diálogo"
          >
            ✕
          </button>
        )}

        {/* Título */}
        {title && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {title}
          </h2>
        )}

        {/* Contenido */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};
