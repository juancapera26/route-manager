import React, { useState, useEffect } from "react";
import { Ruta, Paquete } from "../../../global/types";
import { api } from "../../../global/apis";
import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal/index";

interface ModalDetallesRutaProps {
  isOpen: boolean;
  onClose: () => void;
  ruta: Ruta | null;
}

export const ModalDetallesRuta: React.FC<ModalDetallesRutaProps> = ({
  isOpen,
  onClose,
  ruta,
}) => {
  const [paquetesDeRuta, setPaquetesDeRuta] = useState<Paquete[]>([]);
  const [cargandoPaquetes, setCargandoPaquetes] = useState(false);

  // Cargar paquetes cuando se abre el modal
  useEffect(() => {
    if (!isOpen || !ruta) {
      setPaquetesDeRuta([]);
      return;
    }

    const cargarPaquetesDeRuta = async () => {
      if (ruta.paquetes_asignados.length === 0) {
        setPaquetesDeRuta([]);
        return;
      }

      setCargandoPaquetes(true);
      try {
        const todosPaquetes = await api.paquetes.getAll();
        const paquetesFiltrados = todosPaquetes.filter((paquete) =>
          ruta.paquetes_asignados.includes(paquete.id_paquete)
        );
        setPaquetesDeRuta(paquetesFiltrados);
      } catch (error) {
        console.error("Error al cargar paquetes:", error);
        setPaquetesDeRuta([]);
      } finally {
        setCargandoPaquetes(false);
      }
    };

    cargarPaquetesDeRuta();
  }, [isOpen, ruta]);

  const getColorEstadoPaquete = (estado: string) => {
    switch (estado) {
      case "Entregado":
        return "success";
      case "Fallido":
        return "error";
      case "En Ruta":
        return "primary";
      case "Asignado":
        return "info";
      default:
        return "warning";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {ruta && (
        <div className="p-6 max-w-4xl mx-auto">
          {/* Header del modal */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Paquetes de la Ruta {ruta.id_ruta}
            </h3>
          </div>

          {/* Mini sección total de paquetes */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Paquetes:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {ruta.paquetes_asignados.length}
              </span>
            </div>
          </div>

          {/* Lista de paquetes asignados */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Paquetes Asignados
            </h4>

            {cargandoPaquetes ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  Cargando paquetes...
                </span>
              </div>
            ) : paquetesDeRuta.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  No hay paquetes asignados a esta ruta
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paquetesDeRuta.map((paquete) => (
                  <div
                    key={paquete.id_paquete}
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {paquete.id_paquete}
                      </span>
                      <Badge
                        variant="light"
                        size="sm"
                        color={getColorEstadoPaquete(paquete.estado)}
                      >
                        {paquete.estado}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Destinatario:
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white text-right">
                          {paquete.destinatario.nombre}{" "}
                          {paquete.destinatario.apellido}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Teléfono:
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {paquete.destinatario.telefono}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Cantidad:
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {paquete.cantidad}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Dirección:
                        </span>
                        <p className="text-xs font-medium text-gray-900 dark:text-white mt-1 leading-relaxed">
                          {paquete.destinatario.direccion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
