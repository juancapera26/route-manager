// components/admin/novedad/tablaNovedades.tsx
import { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebaseConfig"; // Ajusta la ruta según tu proyecto
import { API_URL } from "../../../config";

interface Novedad {
  id_novedad: number;
  descripcion: string;
  tipo: string;
  fecha: string;
  imagen: string | null;
  usuario?: {
    nombre: string;
    apellido: string;
    correo: string;
  } | null;
}

const NovedadesTable = () => {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagenModal, setImagenModal] = useState<{
    url: string;
    token: string;
  } | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  useEffect(() => {
    cargarNovedades();
  }, []);

  const cargarNovedades = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        alert("No estás autenticado");
        return;
      }

      const response = await fetch(`${API_URL}/reportes/historial`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al cargar novedades");

      const data = await response.json();
      setNovedades(data);
    } catch (error) {
      console.error("Error al cargar novedades:", error);
      alert("Error al cargar el historial de novedades");
    } finally {
      setLoading(false);
    }
  };

  const abrirImagen = async (idNovedad: number) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        alert("Token no disponible");
        return;
      }

      const url = `${API_URL}/reportes/imagen/${idNovedad}`;

      const response = await fetch(url, {
        method: "HEAD",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) setImagenModal({ url, token });
      else alert("Imagen no disponible");
    } catch (error) {
      console.error("Error al cargar imagen:", error);
      alert("Error al cargar la imagen");
    }
  };

  // Paginación
  const indiceUltimo = paginaActual * itemsPorPagina;
  const indicePrimero = indiceUltimo - itemsPorPagina;
  const novedadesActuales = novedades.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(novedades.length / itemsPorPagina);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg text-gray-600">
          Cargando historial de novedades...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th>ID</th>
                <th>Conductor</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Imagen</th>
              </tr>
            </thead>
            <tbody>
              {novedadesActuales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500">
                    No hay novedades registradas
                  </td>
                </tr>
              ) : (
                novedadesActuales.map((novedad) => (
                  <tr key={novedad.id_novedad}>
                    <td>{novedad.id_novedad}</td>
                    <td>
                      {novedad.usuario ? (
                        <>
                          {novedad.usuario.nombre} {novedad.usuario.apellido}
                          <div className="text-xs text-gray-500">
                            {novedad.usuario.correo}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">
                          Usuario no disponible
                        </span>
                      )}
                    </td>
                    <td>
                      {new Date(novedad.fecha).toLocaleDateString("es-CO")}
                    </td>
                    <td>{novedad.tipo.replace("_", " ")}</td>
                    <td>{novedad.descripcion}</td>
                    <td>
                      {novedad.imagen ? (
                        <button
                          onClick={() => abrirImagen(novedad.id_novedad)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                          Ver Imagen
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Sin imagen
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{indicePrimero + 1}</span> a{" "}
            <span className="font-medium">
              {Math.min(indiceUltimo, novedades.length)}
            </span>{" "}
            de <span className="font-medium">{novedades.length}</span> novedades
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
              }
              disabled={paginaActual === totalPaginas}
              className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal de Imagen */}
      {imagenModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setImagenModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImagenModal(null)}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none transition-colors"
            >
              ✕ Cerrar
            </button>
            <div className="p-4">
              <img
                src={`${imagenModal.url}?auth=${imagenModal.token}`}
                alt="Imagen de novedad"
                className="w-full h-full object-contain max-h-[80vh]"
                onError={() => {
                  alert("Error al cargar la imagen");
                  setImagenModal(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovedadesTable;
