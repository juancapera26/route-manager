// src/components/admin/packages/ModalAsignarPaquete
import React from 'react';
import { Modal } from '../../ui/modal';
import Badge from '../../ui/badge/Badge';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '../../ui/table';
import Button from '../../ui/button/Button';
import { MapPin, Clock, Package } from 'lucide-react';
import { Ruta } from '../../../global/types';

interface ModalAsignarRutaProps {
  isOpen: boolean;
  action: 'assign' | 'reassign' | null;
  rutasDisponibles: Ruta[];
  cerrarModal: () => void;
  handleConfirmarAsignacion: (rutaId: string) => void;
}

export const ModalAsignarPaquete: React.FC<ModalAsignarRutaProps> = ({
  isOpen,
  action,
  rutasDisponibles,
  cerrarModal,
  handleConfirmarAsignacion,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={cerrarModal}>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {action === 'assign' ? 'Asignar Paquete a Ruta' : 'Reasignar Paquete'}
          </h3>
          <Badge variant="light" color="info">
            {rutasDisponibles.length} rutas disponibles
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
                    Ruta
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
                    Zona
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
                    Acción
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rutasDisponibles.map((ruta, index) => (
                  <TableRow
                    key={ruta.id_ruta}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      index % 2 === 0
                        ? 'bg-white dark:bg-gray-800'
                        : 'bg-gray-50/30 dark:bg-gray-800/50'
                    }`}
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                          <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {ruta.id_ruta}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(ruta.horario.inicio).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="text-gray-400 mx-2">-</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(ruta.horario.fin).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge color="info" variant="light" size="sm">
                        {ruta.zona}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                        {ruta.paquetes_asignados.length}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        onClick={() => handleConfirmarAsignacion(ruta.id_ruta)}
                        disabled={!ruta.id_conductor_asignado}
                        variant={ruta.id_conductor_asignado ? 'primary' : 'outline'}
                        className="flex items-center justify-center gap-2"
                      >
                        {ruta.id_conductor_asignado ? (
                          <>
                            <Package className="w-4 h-4" />
                            Asignar ruta
                          </>
                        ) : (
                          'Sin conductor'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Modal>
  );
};