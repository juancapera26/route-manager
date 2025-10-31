// src/components/admin/packages/ModalAsignarPaquete.tsx
import React, { useState } from 'react';
import { Modal } from '../../ui/modal';
import Badge from '../../ui/badge/Badge';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '../../ui/table';
import Button from '../../ui/button/Button';
import { MapPin, Clock, Package, User, Truck, AlertCircle } from 'lucide-react';
import { Paquete } from '../../../global/types/paquete.types';

// ← Tipo para las rutas disponibles (ajusta según tu backend)
interface RutaDisponible {
  id_ruta: number;
  nombre?: string;
  descripcion?: string;
  estado_ruta: string;
  fecha_inicio?: string;
  conductor?: {
    id_conductor: number;
    nombre: string;
    apellido: string;
  };
  vehiculo?: {
    id_vehiculo: number;
    placa: string;
    modelo?: string;
  };
  _count?: {
    paquetes: number;
  };
}

interface ModalAsignarPaqueteProps {
  isOpen: boolean;
  onClose: () => void;
  paquete: Paquete | null;
  rutasDisponibles: RutaDisponible[];
  loading: boolean;
  onConfirm: (paqueteId: number, rutaId: number) => Promise<void>;
}

export const ModalAsignarPaquete: React.FC<ModalAsignarPaqueteProps> = ({
  isOpen,
  onClose,
  paquete,
  rutasDisponibles,
  loading,
  onConfirm,
}) => {
  const [selectedRutaId, setSelectedRutaId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!paquete || !selectedRutaId) return;

    setIsSubmitting(true);
    try {
      await onConfirm(paquete.id_paquete, selectedRutaId);
      setSelectedRutaId(null);
    } catch (error) {
      console.error('Error al asignar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedRutaId(null);
    onClose();
  };

  if (!paquete) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Asignar Paquete a Ruta
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Selecciona una ruta disponible para asignar el paquete
            </p>
          </div>
          <Badge variant="light" color="info">
            {rutasDisponibles.length} rutas disponibles
          </Badge>
        </div>

        {/* Información del Paquete */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
          <div className="flex items-center mb-2">
            <Package className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Paquete #{paquete.id_paquete}
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Destinatario:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {paquete.cliente?.nombre} {paquete.cliente?.apellido}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Tracking:</span>
              <span className="ml-2 font-mono font-medium text-gray-900 dark:text-white">
                {paquete.codigo_rastreo}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600 dark:text-gray-400">Dirección:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {paquete.direccion_entrega}
              </span>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Cargando rutas disponibles...
            </span>
          </div>
        )}

        {/* Empty state */}
        {!loading && rutasDisponibles.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              No hay rutas disponibles en este momento
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Por favor, crea una ruta en estado "Pendiente" primero
            </p>
          </div>
        )}

        {/* Tabla de Rutas */}
        {!loading && rutasDisponibles.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    <TableCell
                      isHeader
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                    >
                      Seleccionar
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                    >
                      Ruta
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                    >
                      Conductor
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
                      Paquetes
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                    >
                      Estado
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rutasDisponibles.map((ruta, index) => (
                    <TableRow
                      key={ruta.id_ruta}
                      onClick={() => setSelectedRutaId(ruta.id_ruta)}
                      className={`border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors cursor-pointer ${
                        selectedRutaId === ruta.id_ruta
                          ? 'bg-blue-100 dark:bg-blue-500/20'
                          : index % 2 === 0
                          ? 'bg-white dark:bg-gray-800'
                          : 'bg-gray-50/30 dark:bg-gray-800/50'
                      }`}
                    >
                      <TableCell className="px-4 py-3">
                        <input
                          type="radio"
                          name="ruta"
                          checked={selectedRutaId === ruta.id_ruta}
                          onChange={() => setSelectedRutaId(ruta.id_ruta)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                            <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Ruta #{ruta.id_ruta}
                            </div>
                            {ruta.descripcion && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {ruta.descripcion}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {ruta.conductor ? (
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {ruta.conductor.nombre} {ruta.conductor.apellido}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                            Sin asignar
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        {ruta.vehiculo ? (
                          <div className="flex items-center">
                            <Truck className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-mono text-gray-900 dark:text-white">
                                {ruta.vehiculo.placa}
                              </div>
                              {ruta.vehiculo.modelo && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {ruta.vehiculo.modelo}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                            Sin asignar
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                          {ruta._count?.paquetes ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <Badge
                          color={ruta.estado_ruta === 'Pendiente' ? 'warning' : 'info'}
                          variant="light"
                          size="sm"
                        >
                          {ruta.estado_ruta}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedRutaId || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Asignando...
              </>
            ) : (
              <>
                <Package className="w-4 h-4 mr-2" />
                Asignar a Ruta
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};