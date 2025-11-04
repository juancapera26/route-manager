import React, { useEffect, useState } from "react";
import TablaRutas from "../../components/admin/routes/TablaRutas";
import { ModalDetallesRuta } from "../../components/admin/routes/ModalDetallesRuta";
import { Ruta, RutaEstado } from "../../global/types/rutas";
import { getAllRutas } from "../../global/services/routeService";
import Badge from "../../components/ui/badge/Badge";
import Alert from "../../components/ui/alert/Alert";

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

const DeliveryHistory: React.FC = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });

  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<Ruta | null>(null);

  useEffect(() => {
    const cargarRutas = async () => {
      setLoading(true);
      try {
        const allRutas = await getAllRutas();
        const completadas = allRutas.filter(
          (r) => r.estado_ruta === RutaEstado.Completada
        );
        setRutas(completadas);
      } catch (error) {
        console.error("Error al cargar rutas:", error);
        mostrarAlert("Error al cargar historial", "error");
      } finally {
        setLoading(false);
      }
    };

    cargarRutas();
  }, []);

  const mostrarAlert = (message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
  };

  const handleAbrirModal = (rutaId: number) => {
    const ruta = rutas.find((r) => r.id_ruta === rutaId);
    if (!ruta) return;
    setRutaSeleccionada(ruta);
    setModalDetallesAbierto(true);
  };

  const handleEliminarRuta = (id_ruta: number) => {
    setRutas((prev) => prev.filter((r) => r.id_ruta !== id_ruta));
    mostrarAlert("Ruta eliminada correctamente", "success");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-500 dark:text-gray-400">
          Cargando historial...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Historial de Entregas Completadas
        </h1>
        <Badge variant="light" color="success">
          {rutas.length}
        </Badge>
      </div>

      {alert.show && (
        <Alert
          variant={alert.type}
          message={alert.message}
          className="mb-6"
          title={""}
        />
      )}

      <TablaRutas
        rutas={rutas}
        estado="Completada"
        onAbrirModal={handleAbrirModal}
        onEliminarRuta={handleEliminarRuta}
        onCancelarAsignacion={() => {}}
        onCompletarRuta={() => {}}
        onMarcarFallida={() => {}}
      />

      <ModalDetallesRuta
        isOpen={modalDetallesAbierto}
        onClose={() => setModalDetallesAbierto(false)}
        ruta={rutaSeleccionada}
      />
    </div>
  );
};

export default DeliveryHistory;
