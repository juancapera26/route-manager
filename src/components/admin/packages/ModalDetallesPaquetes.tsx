import React from 'react';
import { Modal } from '../../ui/modal';
import Badge, { BadgeColor } from '../../ui/badge/Badge';
import { Paquete, PaquetesEstados } from '../../../global/types';
import { XCircle, Package, Ruler, User, Calendar, CheckCircle } from 'lucide-react';

interface ModalDetallesProps {
  detallesPaquete: Paquete | null;
  cerrarModalDetalles: () => void;
}

export const ModalDetallesPaquetes: React.FC<ModalDetallesProps> = ({ detallesPaquete, cerrarModalDetalles }) => {
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
                  ? 'error'
                  : detallesPaquete.estado === PaquetesEstados.EnRuta
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
                  <span className="text-sm text-gray-600 dark:text-gray-400">Rutas Asignadas:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.id_rutas_asignadas.length > 0
                      ? detallesPaquete.id_rutas_asignadas.join(', ')
                      : 'Sin asignar'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Conductor:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.id_conductor_asignado || 'Sin asignar'}
                  </span>
                </div>
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
                    {detallesPaquete.dimensiones.largo} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ancho:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.ancho} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Alto:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.alto} cm
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Peso:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.peso} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Información del destinatario */}
            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                Información del Destinatario
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Nombre completo</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.nombre} {detallesPaquete.destinatario.apellido}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Teléfono</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.telefono}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Correo electrónico</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.correo}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Dirección</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.direccion}
                  </p>
                </div>
              </div>
            </div>

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

          {/* Información de entrega para paquetes entregados */}
          {detallesPaquete.estado === PaquetesEstados.Entregado && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Información de Entrega
              </h4>
              <div className="bg-green-50 dark:bg-green-500/10 rounded-lg p-4">
                <div className="mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Observación del conductor</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.observacion_conductor || 'Sin observaciones'}
                  </p>
                </div>
                {detallesPaquete.imagen_adjunta && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                      Prueba de entrega
                    </span>
                    <img
                      src={"/images/evidence/evidence.jpg"}
                      alt="Prueba de entrega"
                      className="max-h-48 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información de entrega para paquetes fallidos */}
          {detallesPaquete.estado === PaquetesEstados.Fallido && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-500" />
                Información de Entrega Fallida
              </h4>
              <div className="bg-red-50 dark:bg-red-500/10 rounded-lg p-4">
                <div className="mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Observación del conductor</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.observacion_conductor || 'Sin observaciones'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};