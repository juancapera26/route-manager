// components/admin/packages/ModalDetallesPaquetes.tsx
import React from 'react';
import { Modal } from '../../ui/modal';
import Badge from '../../ui/badge/Badge';
import { Paquete, PaquetesEstados } from '../../../global/types/paquete.types';
import { XCircle, Package, Ruler, User, Calendar, CheckCircle } from 'lucide-react';

interface ModalDetallesProps {
  detallesPaquete: Paquete | null;
  cerrarModalDetalles: () => void;
}
//modal para detalles paquete
export const ModalDetallesPaquetes: React.FC<ModalDetallesProps> = ({ 
  detallesPaquete, 
  cerrarModalDetalles 
}) => {
  return (
    <Modal isOpen={!!detallesPaquete} onClose={cerrarModalDetalles}>
      {detallesPaquete && (
        <div className="p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Detalles del Paquete
            </h3>
            <Badge
              variant="light"
              color={
                detallesPaquete.estado === PaquetesEstados.Entregado
                  ? 'success'
                  : detallesPaquete.estado === PaquetesEstados.Fallido
                  ? 'primary'
                  : detallesPaquete.estado === PaquetesEstados.Asignado
                  ? 'info'
                  : 'warning'
              }
            >
              {detallesPaquete.estado}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del paquete */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                Información del Paquete
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">ID:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.id_paquete}
                  </span>
                </div>
                {detallesPaquete.codigo_rastreo && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Código:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {detallesPaquete.codigo_rastreo}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tipo:</span>
                  <Badge variant="light" size="sm">
                    {detallesPaquete.tipo_paquete}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cantidad:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.cantidad}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Valor:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${detallesPaquete.valor_declarado.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ruta:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.ruta?.nombre || detallesPaquete.id_ruta || 'Sin asignar'}
                  </span>
                </div>
                {detallesPaquete.barrio && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Barrio:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {detallesPaquete.barrio.nombre}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Dimensiones y peso */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Ruler className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                Dimensiones
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Largo:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.largo} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ancho:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.ancho} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Alto:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.alto} cm
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Peso:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {detallesPaquete.peso} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Información del cliente/destinatario */}
            {detallesPaquete.cliente && (
              <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Información del Destinatario
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Nombre completo</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {detallesPaquete.cliente.nombre} {detallesPaquete.cliente.apellido}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Teléfono</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {detallesPaquete.cliente.telefono_movil}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Correo electrónico</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {detallesPaquete.cliente.correo}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Dirección registrada</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {detallesPaquete.cliente.direccion}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dirección de entrega (si es diferente) */}
            {detallesPaquete.direccion_entrega && (
              <div className="md:col-span-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-500" />
                  Dirección de Entrega Específica
                </h4>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {detallesPaquete.direccion_entrega}
                </p>
                {(detallesPaquete.lat && detallesPaquete.lng) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Coordenadas: {detallesPaquete.lat}, {detallesPaquete.lng}
                  </p>
                )}
              </div>
            )}

            {/* Fechas */}
            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                Fechas Importantes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha de registro</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {new Date(detallesPaquete.fecha_registro).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fecha de entrega</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.fecha_entrega
                      ? new Date(detallesPaquete.fecha_entrega).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Pendiente'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};