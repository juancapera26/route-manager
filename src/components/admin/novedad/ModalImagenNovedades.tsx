import React from "react";
import { X } from "lucide-react";
import { API_URL } from "../../../config";

interface ModalVerImagenProps {
  imagenUrl: string | null;
  onClose: () => void;
}

// Modal de imagenes

const ModalVerImagen: React.FC<ModalVerImagenProps> = ({
  imagenUrl,
  onClose,
}) => {
  if (!imagenUrl) {
    console.log("⚠️ No hay imagen para mostrar");
    return null;
  }

  // Construir URL completa

  let fullImageUrl: string;

  if (imagenUrl.startsWith("http")) {
    fullImageUrl = imagenUrl;
  } else {
    let normalizedPath = imagenUrl.startsWith("/")
      ? imagenUrl
      : `/${imagenUrl}`;

    if (!normalizedPath.includes("/uploads/")) {
      const filename = normalizedPath.split("/").pop();
      normalizedPath = `/uploads/${filename}`;
    }

    fullImageUrl = `${API_URL}${normalizedPath}`;
  }

  console.log("🖼️ Imagen original:", imagenUrl);
  console.log("🖼️ URL completa construida:", fullImageUrl);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg max-w-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con solo botón de cerrar */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Imagen de la novedad
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Imagen */}
        <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <img
            src={fullImageUrl}
            alt="Novedad"
            className="max-h-[80vh] rounded-lg object-contain"
            onLoad={() => {
              console.log("✅ Imagen cargada correctamente:", fullImageUrl);
            }}
            onError={(e) => {
              console.error("❌ Error al cargar imagen:", fullImageUrl);
              e.currentTarget.src =
                "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalVerImagen;
