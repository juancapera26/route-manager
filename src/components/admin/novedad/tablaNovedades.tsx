// components/admin/novedad/tablaNovedades.tsx
import { useState, useEffect } from 'react';
import { auth } from '../../../firebase/firebaseConfig'; // Ajusta la ruta según tu proyecto

interface Novedad {
  id_novedad: number;
  descripcion: string;
  tipo: string;
  fecha: string;
  imagen: string | null;
  usuario: {
    nombre: string;
    apellido: string;
    correo: string;
  };
}

const NovedadesTable = () => {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagenModal, setImagenModal] = useState<{ url: string; token: string } | null>(null);
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
        alert('No estás autenticado');
        return;
      }

      const response = await fetch('http://localhost:3000/reportes/historial', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar novedades');
      }

      const data = await response.json();
      setNovedades(data);
    } catch (error) {
      console.error('Error al cargar novedades:', error);
      alert('Error al cargar el historial de novedades');
    } finally {
      setLoading(false);
    }
  };

  const abrirImagen = async (idNovedad: number) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        alert('Token no disponible');
        return;
      }

      const url = `http://localhost:3000/reportes/imagen/${idNovedad}`;

      // Verificar que la imagen existe
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setImagenModal({ url, token });
      } else {
        alert('Imagen no disponible');
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      alert('Error al cargar la imagen');
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
        <div className="text-lg text-gray-600">Cargando historial de novedades...</div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conductor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {novedadesActuales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay novedades registradas
                  </td>
                </tr>
              ) : (
                novedadesActuales.map((novedad) => (
                  <tr key={novedad.id_novedad} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {novedad.id_novedad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {novedad.usuario.nombre} {novedad.usuario.apellido}
                      </div>
                      <div className="text-xs text-gray-500">{novedad.usuario.correo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(novedad.fecha).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          novedad.tipo === 'accidente'
                            ? 'bg-red-100 text-red-800'
                            : novedad.tipo === 'falla_mecanica'
                            ? 'bg-orange-100 text-orange-800'
                            : novedad.tipo === 'retraso'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {novedad.tipo.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={novedad.descripcion}>
                        {novedad.descripcion}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {novedad.imagen ? (
                        <button
                          onClick={() => abrirImagen(novedad.id_novedad)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          Ver Imagen
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Sin imagen</span>
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
            Mostrando <span className="font-medium">{indicePrimero + 1}</span> a{' '}
            <span className="font-medium">{Math.min(indiceUltimo, novedades.length)}</span> de{' '}
            <span className="font-medium">{novedades.length}</span> novedades
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 z-10 transition-colors"
            >
              ✕ Cerrar
            </button>
            <div className="p-4">
              <img
                src={`${imagenModal.url}?auth=${imagenModal.token}`}
                alt="Imagen de novedad"
                className="w-full h-full object-contain max-h-[80vh]"
                onError={() => {
                  alert('Error al cargar la imagen');
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
