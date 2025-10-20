import React, { useState, useEffect } from "react";
import { Ruta } from "../../../global/types";
import Badge from "../../ui/badge/Badge";
import { Modal } from "../../ui/modal/index";
import { Paquete, PaquetesEstados } from "../../../global/types/paquete.types";

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

  // ✅ Generar paquetes simulados consistentes con los IDs de la ruta
  useEffect(() => {
    if (!isOpen || !ruta) {
      setPaquetesDeRuta([]);
      return;
    }

    const cargarPaquetesDeRuta = async () => {
      if (!ruta.paquetes_asignados || ruta.paquetes_asignados.length === 0) {
        setPaquetesDeRuta([]);
        return;
      }

      setCargandoPaquetes(true);

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
        // Crear paquetes simulados basados en los IDs de la ruta
        const paquetesSimulados: Paquete[] = ruta.paquetes_asignados.map((idPaquete, index) => ({
          id_paquete: parseInt(idPaquete) || index + 1,
          codigo_rastreo: `PKG-${String(idPaquete).padStart(6, '0')}`,
          fecha_registro: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          fecha_entrega: null,
          estado: ruta.estado === 'Asignada' ? PaquetesEstados.Asignado : PaquetesEstados.Pendiente,
          tipo_paquete: ['Pequeño', 'Mediano', 'Grande', 'Fragil'][Math.floor(Math.random() * 4)] as any,
          dimensiones: {
            largo: 20 + Math.floor(Math.random() * 50),
            ancho: 15 + Math.floor(Math.random() * 30),
            alto: 10 + Math.floor(Math.random() * 20),
            peso: 1 + Math.floor(Math.random() * 10)
          },
          cantidad: 1 + Math.floor(Math.random() * 3),
          valor_declarado: 10000 + Math.floor(Math.random() * 90000),
          direccion_entrega: `Calle ${Math.floor(Math.random() * 100)} # ${Math.floor(Math.random() * 50)}-${Math.floor(Math.random() * 100)}`,
          lat: 4.6 + Math.random() * 0.2,
          lng: -74.1 + Math.random() * 0.2,
          id_cliente: 1000 + index,
          id_ruta: parseInt(ruta.id_ruta.split('-')[1]) || null,
          id_barrio: Math.floor(Math.random() * 20) + 1,
          cliente: {
            id_cliente: 1000 + index,
            nombre: ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Sofia'][Math.floor(Math.random() * 6)],
            apellido: ['García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez'][Math.floor(Math.random() * 6)],
            direccion: `Calle ${Math.floor(Math.random() * 100)} # ${Math.floor(Math.random() * 50)}-${Math.floor(Math.random() * 100)}`,
            correo: `cliente${1000 + index}@ejemplo.com`,
            telefono_movil: `300${Math.floor(Math.random() * 10000000)}`
          }
        }));

        setPaquetesDeRuta(paquetesSimulados);
      } catch (error) {
        console.error("Error al generar paquetes:", error);
        setPaquetesDeRuta([]);
      } finally {
        setCargandoPaquetes(false);
      }
    };

    cargarPaquetesDeRuta();
  }, [isOpen, ruta]);

  const getColorEstadoPaquete = (estado: PaquetesEstados) => {
    switch (estado) {
      case PaquetesEstados.Entregado:
        return "success";
      case PaquetesEstados.Fallido:
        return "error";
      case PaquetesEstados.EnRuta:
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
          {/* Header del modal */}
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

          {/* Mini sección total de paquetes */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total de Paquetes Asignados:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {ruta.paquetes_asignados?.length || 0}
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
                        color={getColorEstadoPaquete(paquete.estado)}
                      >
                        {paquete.estado}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {paquete.cliente && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Destinatario:
                            </span>
                            <span className="text-xs font-medium text-gray-900 dark:text-white text-right">
                              {paquete.cliente.nombre} {paquete.cliente.apellido}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Teléfono:
                            </span>
                            <span className="text-xs font-medium text-gray-900 dark:text-white">
                              {paquete.cliente.telefono_movil}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Tipo:
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
                          {paquete.dimensiones.peso} kg
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
                          {paquete.direccion_entrega || paquete.cliente?.direccion || 'No especificada'}
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