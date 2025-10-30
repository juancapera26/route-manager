// src/components/admin/vehicles/ModalAsignarVehiculo.tsx
import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Badge, { BadgeColor } from "../../ui/badge/Badge";
import { Vehiculo } from "../../../global/types/vehiclesType";
import { Ruta, RutaEstado } from "../../../global/types/rutas";
import { getAllRutas } from "../../../global/services/routeService";
import { Truck, Package, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";

interface ModalAsignarVehiculoProps {
  isOpen: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;
}

export const ModalAsignarVehiculo: React.FC<ModalAsignarVehiculoProps> = ({
  isOpen,
  onClose,
  vehiculo,
}) => {
  const [rutasPendientes, setRutasPendientes] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(false);
  const [asignando, setAsignando] = useState(false);

  // 🔹 Cargar rutas pendientes al abrir el modal
  useEffect(() => {
    if (isOpen && vehiculo) {
      cargarRutasPendientes();
    }
  }, [isOpen, vehiculo]);

  const cargarRutasPendientes = async () => {
    setLoading(true);
    try {
      const todasLasRutas = await getAllRutas();
      // Filtrar solo rutas pendientes
      const pendientes = todasLasRutas.filter(
        (ruta) => ruta.estado_ruta === RutaEstado.Pendiente
      );
      setRutasPendientes(pendientes);
    } catch (error) {
      console.error("Error al cargar rutas pendientes:", error);
      toast.error("Error al cargar las rutas pendientes");
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarVehiculo = async (ruta: Ruta) => {
    if (!vehiculo) return;

    setAsignando(true);
    try {
      // 🔹 AQUÍ IMPLEMENTARÁS LA LLAMADA AL BACKEND
      // Por ahora, simulamos la asignación
      
      // const response = await fetch(`http://localhost:8080/rutas/${ruta.id_ruta}/asignar-vehiculo`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ id_vehiculo: vehiculo.id_vehiculo })
      // });

      toast.success(
        `Vehículo ${vehiculo.placa} asignado a la ruta ${ruta.cod_manifiesto || ruta.id_ruta}`
      );
      
      // Actualizar la lista quitando la ruta asignada
      setRutasPendientes((prev) =>
        prev.filter((r) => r.id_ruta !== ruta.id_ruta)
      );

      // Cerrar modal si ya no hay más rutas
      if (rutasPendientes.length === 1) {
        setTimeout(() => onClose(), 1500);
      }
    } catch (error) {
      console.error("Error al asignar vehículo:", error);
      toast.error("Error al asignar el vehículo a la ruta");
    } finally {
      setAsignando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!vehiculo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Truck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Asignar Vehículo a Ruta
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vehículo: <span className="font-mono font-bold">{vehiculo.placa}</span>
              </p>
            </div>
          </div>
          <Badge variant="light" color="info">
            {rutasPendientes.length} rutas disponibles
          </Badge>
        </div>

        {/* Información del vehículo */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tipo de Vehículo
              </span>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {vehiculo.tipo.charAt(0).toUpperCase() + vehiculo.tipo.slice(1)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Estado
              </span>
              <div className="mt-1">
                <Badge
                  variant="light"
                  size="sm"
                  color={
                    vehiculo.estado_vehiculo === "Disponible"
                      ? "success"
                      : "error"
                  }
                >
                  {vehiculo.estado_vehiculo}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de rutas pendientes */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
            Rutas Pendientes de Asignación
          </h4>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Cargando rutas...
              </span>
            </div>
          ) : rutasPendientes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No hay rutas pendientes
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Todas las rutas han sido asignadas
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rutasPendientes.map((ruta) => (
                <div
                  key={ruta.id_ruta}
                  className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {ruta.cod_manifiesto || `Ruta #${ruta.id_ruta}`}
                        </span>
                        <Badge variant="light" size="sm" color="warning">
                          {ruta.estado_ruta}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Inicio: {formatearFecha(ruta.fecha_inicio)}</span>
                        </div>

                        {ruta.paquete && ruta.paquete.length > 0 && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Package className="w-4 h-4 mr-2" />
                            <span>{ruta.paquete.length} paquetes</span>
                          </div>
                        )}

                        {ruta.usuario && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Conductor: {ruta.usuario.nombre}{" "}
                            {ruta.usuario.apellido}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAsignarVehiculo(ruta)}
                      disabled={asignando}
                      className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {asignando ? "Asignando..." : "Asignar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};