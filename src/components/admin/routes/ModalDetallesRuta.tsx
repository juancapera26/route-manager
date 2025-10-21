// src/components/admin/routes/ModalDetallesRuta.tsx
import React, { useState, useEffect } from "react";
import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal/index";
import { Ruta } from "../../../global/types/rutas";

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
  // ✅ Siempre array, nunca undefined
  const [paquetesDeRuta, setPaquetesDeRuta] = useState<
    NonNullable<Ruta["paquete"]>
  >([]);
  const [cargandoPaquetes, setCargandoPaquetes] = useState(false);

  // ✅ Generar paquetes simulados consistentes con los IDs de la ruta
  useEffect(() => {
    if (!isOpen || !ruta) {
      setPaquetesDeRuta([]);
      return;
    }

    setCargandoPaquetes(true);
    setPaquetesDeRuta(ruta.paquete ?? []);
    setCargandoPaquetes(false);
  }, [isOpen, ruta]);

  // Ajuste de colores según estado
  const getColorEstadoPaquete = (estado: string) => {
    switch (estado) {
      case PaquetesEstados.Entregado:
        return "success";
      case PaquetesEstados.Fallido:
        return "error";
      case "En_ruta":
        return "primary";
      case PaquetesEstados.Asignado:
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
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Paquetes de la Ruta {ruta.id_ruta}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Estado: <Badge variant="light" color="info" size="sm">{ruta.estado}</Badge>
              </p>
            </div>
            <Badge variant="light" color="warning" size="sm">
              Datos Simulados
            </Badge>
          </div>

          {/* Total de paquetes */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Paquetes Asignados:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {paquetesDeRuta.length}
              </span>
            </div>
          </div>

          {/* Lista de paquetes */}
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
                  Generando paquetes...
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
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          #{paquete.id_paquete}
                        </span>
                        {paquete.codigo_rastreo && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {paquete.codigo_rastreo}
                          </p>
                        )}
                      </div>
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
                          {paquete.destinatario?.nombre}{" "}
                          {paquete.destinatario?.apellido}
                        </span>
                        <Badge variant="light" size="sm">
                          {paquete.tipo_paquete}
                        </Badge>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Peso:
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {paquete.destinatario?.telefono || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Valor:
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          ${paquete.valor_declarado.toLocaleString()}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Dirección de entrega:
                        </span>
                        <p className="text-xs font-medium text-gray-900 dark:text-white mt-1 leading-relaxed">
                          {paquete.destinatario?.direccion || "-"}
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
};*/