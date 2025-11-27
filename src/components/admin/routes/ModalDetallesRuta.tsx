import React, { useState, useEffect } from "react";
import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal/index";
import { Ruta } from "../../../global/types/rutas";
import { Paquete } from "../../../global/types/paquete.types";

interface ModalDetallesRutaProps {
  isOpen: boolean;
  detallesPaquete: Paquete | null;

  onClose: () => void;
  ruta: Ruta | null;
}

export const ModalDetallesRuta: React.FC<ModalDetallesRutaProps> = ({
  isOpen,
  onClose,
  ruta,
}) => {
  const [paquetesDeRuta, setPaquetesDeRuta] = useState<
    NonNullable<Ruta["paquete"]>
  >([]);
  const [cargandoPaquetes, setCargandoPaquetes] = useState(false);

  useEffect(() => {
    if (!isOpen || !ruta) {
      setPaquetesDeRuta([]);
      return;
    }

    setCargandoPaquetes(true);
    setPaquetesDeRuta(ruta.paquete ?? []);
    setCargandoPaquetes(false);
  }, [isOpen, ruta]);

  const getColorEstadoPaquete = (estado: string) => {
    switch (estado) {
      case "Entregado":
        return "success";
      case "Fallido":
        return "error";
      case "En_ruta":
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Paquetes de la Ruta {ruta.id_ruta}
            </h3>
          </div>

          {/* Total de paquetes */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Paquetes:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {paquetesDeRuta.length}
              </span>
            </div>
          </div>

          {/* Lista de paquetes */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
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
                        color={getColorEstadoPaquete(paquete.estado_paquete)}
                      >
                        {paquete.estado_paquete}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Destinatario:
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white text-right">
                          {paquete.cliente?.nombre}{" "}
                          {paquete.cliente?.apellido || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Teléfono:
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {paquete.cliente?.telefono || "-"}{" "}
                          {/* Cambio a telefono */}
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
                          {paquete.cliente.direccion}
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
