/*import React from "react";
import { Modal } from "../../ui/modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import Badge from "../../ui/badge/Badge";
import { Conductor, ConductorEstado, Vehiculo } from "../../../global/types";

interface ModalAsignarConductorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (conductorId: string) => void;
  conductores: Conductor[];
  vehiculos: Vehiculo[]; // Array de vehículos para obtener el tipo
  titulo?: string; // Para reutilizar el modal (asignar/reasignar)
}

export const ModalAsignarConductor: React.FC<ModalAsignarConductorProps> = ({
  isOpen,
  onClose,
  onConfirm,
  conductores,
  vehiculos,
  titulo = "Asignar Conductor a Ruta",
}) => {
  // Filtrar solo conductores disponibles
  const conductoresDisponibles = conductores.filter(
    (conductor) => conductor.estado === ConductorEstado.Disponible
  );

  // Función helper para obtener el tipo de vehículo
  const obtenerTipoVehiculo = (idVehiculo?: string): string => {
    if (!idVehiculo) return "Sin vehículo";
    const vehiculo = vehiculos.find((v) => v.id_vehiculo === idVehiculo);
    return vehiculo?.tipo_vehiculo || "Tipo no encontrado";
  };

  // Función para manejar la confirmación de asignación
  const handleConfirmarAsignacion = (conductorId: string) => {
    onConfirm(conductorId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {titulo}
          </h3>
          <Badge variant="light" color="info">
            {conductoresDisponibles.length} conductores disponibles
          </Badge>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto max-h-96">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-700">
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                  >
                    ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                  >
                    Nombre
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                  >
                    Horario
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                  >
                    Vehículo
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                  >
                    Acción
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conductoresDisponibles.map((conductor, index) => (
                  <TableRow
                    key={conductor.id_conductor}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50/30 dark:bg-gray-800/50"
                    }`}
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-blue-500 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {conductor.id_conductor}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {conductor.nombre} {conductor.apellido}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {conductor.horario ? (
                        <div>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {new Date(
                              conductor.horario.inicio
                            ).toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-gray-400 mx-2">-</span>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {new Date(conductor.horario.fin).toLocaleTimeString(
                              "es-ES",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Sin horario definido
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {obtenerTipoVehiculo(conductor.id_vehiculo_asignado)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleConfirmarAsignacion(conductor.id_conductor)
                        }
                        variant="primary"
                      >
                        Asignar conductor
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mensaje cuando no hay conductores disponibles 
          {conductoresDisponibles.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay conductores disponibles
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Todos los conductores están ocupados o no disponibles en este
                momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};*/
