// src/components/admin/vehicles/ModalDetallesVehiculo.tsx
import React from 'react';
import { Modal } from '../../ui/modal';
import Badge, { BadgeColor } from '../../ui/badge/Badge';
import { Vehiculo, EstadoVehiculo, TipoVehiculo } from '../../../global/types/vehiclesType';
import { Package, Truck, Info } from 'lucide-react';

interface ModalDetallesVehiculoProps {
  isOpen: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;
}

export const ModalDetallesVehiculo: React.FC<ModalDetallesVehiculoProps> = ({
  isOpen,
  onClose,
  vehiculo,
}) => {
  if (!vehiculo) return null;

  /**
   * Obtener el color del badge según el estado
   */
  const getEstadoColor = (estado: EstadoVehiculo): BadgeColor => {
    return estado === EstadoVehiculo.Disponible ? 'success' : 'error';
  };

  /**
   * Obtener el icono según el tipo de vehículo
   */
  const getTipoIcon = (tipo: TipoVehiculo) => {
    switch (tipo) {
      case TipoVehiculo.Camion:
      case TipoVehiculo.Camioneta:
      case TipoVehiculo.Furgon:
        return <Truck className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
      case TipoVehiculo.Moto:
        return (
          <svg 
            className="w-5 h-5 text-gray-500 dark:text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
        );
      default:
        return <Package className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  /**
   * Formatear el tipo de vehículo
   */
  const formatTipo = (tipo: TipoVehiculo): string => {
    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Detalles del Vehículo
          </h3>
          <Badge
            variant="light"
            color={getEstadoColor(vehiculo.estado_vehiculo)}
          >
            {vehiculo.estado_vehiculo}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Información principal */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Info className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
              Información Principal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">ID del Vehículo</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {vehiculo.id_vehiculo}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Placa</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1 font-mono">
                  {vehiculo.placa}
                </p>
              </div>
            </div>
          </div>

          {/* Especificaciones del vehículo */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              {getTipoIcon(vehiculo.tipo)}
              <span className="ml-2">Especificaciones</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Tipo de Vehículo</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {formatTipo(vehiculo.tipo)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Estado Actual</span>
                <div className="mt-1">
                  <Badge
                    variant="light"
                    size="sm"
                    color={getEstadoColor(vehiculo.estado_vehiculo)}
                  >
                    {vehiculo.estado_vehiculo}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional según tipo */}
          <div className="bg-blue-50 dark:bg-blue-500/10 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Capacidad estimada:</strong>{' '}
              {vehiculo.tipo === TipoVehiculo.Moto && 'Hasta 30kg - Entregas pequeñas'}
              {vehiculo.tipo === TipoVehiculo.Camioneta && 'Hasta 500kg - Entregas medianas'}
              {vehiculo.tipo === TipoVehiculo.Furgon && 'Hasta 1,500kg - Entregas grandes'}
              {vehiculo.tipo === TipoVehiculo.Camion && 'Más de 3,000kg - Entregas grandes y múltiples'}
            </p>
          </div>

          {/* Estado de disponibilidad */}
          {vehiculo.estado_vehiculo === EstadoVehiculo.NoDisponible && (
            <div className="bg-red-50 dark:bg-red-500/10 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-300">
                <strong>⚠️ Vehículo no disponible:</strong> Este vehículo no puede ser asignado a rutas en este momento.
              </p>
            </div>
          )}

          {vehiculo.estado_vehiculo === EstadoVehiculo.Disponible && (
            <div className="bg-green-50 dark:bg-green-500/10 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-300">
                <strong>✅ Vehículo disponible:</strong> Este vehículo puede ser asignado a nuevas rutas.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};