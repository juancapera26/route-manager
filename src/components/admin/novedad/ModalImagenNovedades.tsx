import React from "react";
import { X } from "lucide-react";

interface ModalVerImagenProps {
  imagenUrl: string | null;
  onClose: () => void;
}

const ModalVerImagen: React.FC<ModalVerImagenProps> = ({ imagenUrl, onClose }) => {
  if (!imagenUrl) return null; // No renderiza si no hay imagen

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg max-w-3xl w-full">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:text-white"
        >
          <X size={22} />
        </button>

        {/* Imagen */}
        <div className="flex items-center justify-center">
          <img
            src={imagenUrl}
            alt="Novedad"
            className="max-h-[80vh] rounded-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ModalVerImagen;
