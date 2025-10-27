import React, { useState } from "react";
import { useNovedades } from "../../hooks/admin/useNovedades";
import NovedadesTable from "../../components/admin/novedad/tablaNovedades";

// Modal
import ModalImagen from "../../components/admin/novedad/ModalImagenNovedades";
import { Novedad } from "../../global/types/novedades";

const NovedadesOrquestador: React.FC = () => {
  const { novedades, loading, error } = useNovedades();
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);

  // ✅ Handler para abrir modal con imagen
  const handleVerImagen = (url: string) => setImagenSeleccionada(url);
  const handleCerrarModal = () => setImagenSeleccionada(null);

  if (loading)
    return <p className="text-center text-gray-500">Cargando novedades...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">
        Ocurrió un error al cargar las novedades.
      </p>
    );

  return (
    <div className="space-y-4">
      {/* Tabla de novedades */}
      <NovedadesTable novedades={novedades as Novedad[]} onVerImagen={handleVerImagen} />

      {/* Modal de imagen */}
      {imagenSeleccionada && (
        <ModalImagen imagenUrl={imagenSeleccionada} onClose={handleCerrarModal} />
      )}
    </div>
  );
};

export default NovedadesOrquestador;
