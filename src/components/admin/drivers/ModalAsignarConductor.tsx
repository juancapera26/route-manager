import React from "react";
import { Ruta } from "../../../global/types/rutas";
import { Dialog } from "../../ui/modal/Dialog";
import Button from "../../ui/button/Button";
import { RutaEstado } from "../../../global/types/rutas";

interface Props {
  routes: Ruta[];
  onAssign: () => void; // Ejecuta directamente
  onClose: () => void;
  isOpen: boolean;
  onSelectRoute: (codManifiesto: string) => void; // Recibe cod_manifiesto
}

export default function AssignRouteModal({
  routes,
  onAssign,
  onClose,
  isOpen,
  onSelectRoute,
}: Props) {
  const filteredRoutes = routes.filter(
    (r) => r.estado_ruta === RutaEstado.Pendiente
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Asignar Ruta"
      className="max-w-2xl w-full" // sobrescribe el predeterminado
    >
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
                <th className="px-6 py-3">Código de Manifiesto</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha Creación</th>
                <th className="px-6 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((r) => (
                  <tr
                    key={r.id_ruta}
                    className="border-b hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700 font-mono font-semibold">
                      {r.cod_manifiesto || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full">
                        {r.estado_ruta}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {r.fecha_creacion
                        ? new Date(r.fecha_creacion).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="primary"
                        onClick={() => {
                          onSelectRoute(r.cod_manifiesto!);
                          onAssign();
                        }}
                        disabled={!r.cod_manifiesto}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Asignar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p>No hay rutas pendientes para asignar.</p>
                      <p className="text-sm text-gray-400">
                        Todas las rutas han sido asignadas o no existen rutas
                        disponibles.
                      </p>
                    </div>
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
            onClick={onClose}
            className="w-full md:w-auto px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-200"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
