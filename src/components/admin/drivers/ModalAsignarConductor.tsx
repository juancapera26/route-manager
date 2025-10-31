import React from "react";
import { Ruta } from "../../../global/types/rutas";
import { Dialog } from "../../ui/modal/Dialog";
import Button from "../../ui/button/Button";
import { RutaEstado } from "../../../global/types/rutas"; // Importar el enum RutaEstado

interface Props {
  routes: Ruta[]; // Acepta un array de rutas
  onAssign: (routeId: number) => void; // Función para asignar la ruta
  onClose: () => void; // Función para cerrar el modal
  isOpen: boolean; // Propiedad que controla si el modal está abierto o cerrado
  onSelectRoute: (routeId: number) => void; // Función para seleccionar la ruta
}

export default function AssignRouteModal({
  routes,
  onAssign,
  onClose,
  isOpen,
  onSelectRoute,
}: Props) {
  // Filtrar solo las rutas con estado "Pendiente"
  const filteredRoutes = routes.filter(
    (r) => r.estado_ruta === RutaEstado.Pendiente
  );

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Asignar Ruta">
      <div className="space-y-6">
        {/* Título y descripción */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
          Selecciona la ruta que deseas asignar al conductor.
        </p>

        {/* Tabla de rutas */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-separate border-spacing-0 rounded-lg">
            <thead>
              <tr className="bg-blue-100 text-left text-sm font-semibold text-gray-700">
                <th className="px-6 py-3">Código de Manifiesto</th>{" "}
                {/* Título actualizado */}
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((r) => (
                  <tr key={r.id_ruta} className="border-b hover:bg-blue-50">
                    <td className="px-6 py-4 text-gray-700">
                      {r.cod_manifiesto}
                    </td>{" "}
                    {/* Campo actualizado */}
                    <td className="px-6 py-4 text-gray-700">{r.estado_ruta}</td>
                    <td className="px-6 py-4">
                      <Button
                        variant="primary"
                        onClick={() => {
                          onSelectRoute(r.id_ruta); // Sigue usando el id para la asignación
                          onAssign(r.id_ruta); // Asigna la ruta
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Asignar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No hay rutas pendientes para asignar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Botón de cancelación */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            onClick={onClose} // Cierra el modal
            className="w-full md:w-auto px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
