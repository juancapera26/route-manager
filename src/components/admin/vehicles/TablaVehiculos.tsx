// src/components/admin/vehicles/TablaVehiculos.tsx
import React from "react";
import { Vehiculo, EstadoVehiculo, TipoVehiculo } from "../../../global/types/vehiclesType";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { Eye, Edit, Trash2, CheckCircle, XCircle, TruckIcon } from "lucide-react";

interface TablaVehiculosProps {
  vehiculos: Vehiculo[];
  onVerDetalles: (vehiculo: Vehiculo) => void;
  onEditar: (vehiculo: Vehiculo) => void;
  onEliminar: (id: string) => void;
  onCambiarEstado: (id: string, disponible: boolean) => void;
  onAsignarVehiculo: (vehiculo: Vehiculo) => void;
}

const TablaVehiculos: React.FC<TablaVehiculosProps> = ({
  vehiculos,
  onVerDetalles,
  onEditar,
  onEliminar,
  onCambiarEstado,
  onAsignarVehiculo,
}) => {
  /**
   * Obtener color del badge según el estado
   */
  const getEstadoColor = (estado: EstadoVehiculo) => {
    return estado === EstadoVehiculo.Disponible ? "success" : "error";
  };

  /**
   * Obtener color del badge según el tipo
   */
  const getTipoColor = (tipo: TipoVehiculo) => {
    switch (tipo) {
      case TipoVehiculo.Moto:
        return "info";
      case TipoVehiculo.Camioneta:
        return "warning";
      case TipoVehiculo.Furgon:
        return "primary";
      case TipoVehiculo.Camion:
        return "error";
      default:
        return "light";
    }
  };

  /**
   * Formatear tipo de vehículo
   */
  const formatTipo = (tipo: TipoVehiculo): string => {
    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
  };

  if (vehiculos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 p-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
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
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No hay vehículos registrados
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Comienza agregando un vehículo usando el botón "Agregar vehículo"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                ID
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                Placa
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                Tipo
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                Estado
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehiculos.map((vehiculo, index) => (
              <TableRow
                key={vehiculo.id_vehiculo}
                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50/30 dark:bg-gray-800/50"
                }`}
              >
                {/* ID */}
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-mono text-gray-900 dark:text-white">
                    {vehiculo.id_vehiculo}
                  </span>
                </TableCell>

                {/* Placa */}
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                    {vehiculo.placa}
                  </span>
                </TableCell>

                {/* Tipo */}
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="light"
                    size="sm"
                    color={getTipoColor(vehiculo.tipo)}
                  >
                    {formatTipo(vehiculo.tipo)}
                  </Badge>
                </TableCell>

                {/* Estado */}
                <TableCell className="px-6 py-4">
                  <Badge
                    variant="light"
                    size="sm"
                    color={getEstadoColor(vehiculo.estado_vehiculo)}
                  >
                    {vehiculo.estado_vehiculo}
                  </Badge>
                </TableCell>

                {/* Acciones */}
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Ver detalles */}
                    <button
                      onClick={() => onVerDetalles(vehiculo)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Editar */}
                    <button
                      onClick={() => onEditar(vehiculo)}
                      className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar vehículo"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* nuevo: Boton  Asignar a una ruta */}
                    {vehiculo.estado_vehiculo === EstadoVehiculo.Disponible && (
                      <button
                        onClick={() => onAsignarVehiculo(vehiculo)}
                        className="p-2 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors"
                        title="Asignar a ruta"
                      >
                        <TruckIcon className="w-4 h-4" />
                      </button>
                    )}

                    {/* Cambiar estado */}
                    {vehiculo.estado_vehiculo === EstadoVehiculo.Disponible ? (
                      <button
                        onClick={() => onCambiarEstado(vehiculo.id_vehiculo, false)}
                        className="p-2 text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors"
                        title="Marcar como no disponible"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onCambiarEstado(vehiculo.id_vehiculo, true)}
                        className="p-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                        title="Marcar como disponible"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* Eliminar */}
                    <button
                      onClick={() => onEliminar(vehiculo.id_vehiculo)}
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Eliminar vehículo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TablaVehiculos;