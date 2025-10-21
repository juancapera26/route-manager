import React, { useState, useEffect } from "react";

// Componentes
import { ModalAgregarRuta } from "../../components/admin/routes/ModalAgregarRuta";
import TablaRutas from "../../components/admin/routes/TablaRutas";
import { ModalDetallesRuta } from "../../components/admin/routes/ModalDetallesRuta";

// Tipos
import { Ruta, RutaEstado, RutaFormData } from "../../global/types/rutas";

// Servicio
import { getAllRutas } from "../../global/services/routeService";

// UI
import Badge from "../../components/ui/badge/Badge";
import Alert from "../../components/ui/alert/Alert";

// Filtros
import { useEstadoFilter } from "../../hooks/useEstadoFilter";
import {
  opcionesFiltroRutas,
  obtenerEstadoRuta,
} from "../../global/config/filterConfigs";
import EstadoFilterDropdown from "../../components/common/EstadoFilter";
import { Plus } from "lucide-react";

interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

const RouteManagement: React.FC = () => {
  const [todasLasRutas, setTodasLasRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Estado para el modal de detalles
  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<Ruta | null>(null);

  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });

  // Hook del filtro
  const filtroEstado = useEstadoFilter({
    opciones: opcionesFiltroRutas,
    valorInicial: null,
    obtenerEstado: obtenerEstadoRuta,
  });

  // 🟢 Cargar rutas desde backend
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const rutas = await getAllRutas();
        setTodasLasRutas(rutas);
      } catch (error) {
        console.error("❌ Error al cargar rutas:", error);
        mostrarAlert("Error al cargar las rutas", "error");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const mostrarAlert = (message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
  };

  // 🔵 Filtrar rutas por estado
  const rutasFiltradas = filtroEstado.filtrarPorEstado(todasLasRutas);

  // 🔹 Función auxiliar para renderizar una sección
  const renderSeccion = (
    titulo: string,
    color: React.ComponentProps<typeof Badge>["color"],
    rutas: Ruta[]
  ) => (
    <section key={titulo}>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {titulo}
        </h2>
        <Badge variant="light" color={color}>
          {rutas.length}
        </Badge>
      </div>

      <TablaRutas
        rutas={rutas}
        estado={titulo}
        onAbrirModal={handleAbrirModal}
        onEliminarRuta={handleEliminarRuta}
        onCancelarAsignacion={handleCancelarAsignacion}
        onCompletarRuta={handleCompletarRuta}
        onMarcarFallida={handleMarcarFallid_ruta}
      />

      <ModalDetallesRuta
        isOpen={modalDetallesAbierto}
        onClose={() => setModalDetallesAbierto(false)}
        ruta={rutaSeleccionada}
      />
    </section>
  );

  // ⚙️ Manejadores de acciones
  const handleAbrirModal = (rutaId: number, action: "details" | "assign") => {
    const ruta = todasLasRutas.find((r) => r.id_ruta === rutaId);
    if (!ruta) return;

    if (action === "details") {
      setRutaSeleccionada(ruta);
      setModalDetallesAbierto(true);
    } else if (action === "assign") {
      mostrarAlert(`Asignar ruta ${rutaId}`, "info");
      // Aquí podrías abrir un modal de asignación si lo tienes
    }
  };

  const handleEliminarRuta = (id_ruta: number) => {
    setTodasLasRutas((prev) => prev.filter((r) => r.id_ruta !== id_ruta));
    mostrarAlert("Ruta eliminada correctamente", "success");
  };

  const handleCancelarAsignacion = (id_ruta: number) => {
    mostrarAlert(`Asignación de ruta ${id_ruta} cancelada`, "warning");
  };

  const handleCompletarRuta = (id_ruta: number) => {
    mostrarAlert(`Ruta ${id_ruta} completada`, "success");
  };

  const handleMarcarFallid_ruta = (id_ruta: number) => {
    mostrarAlert(`Ruta ${id_ruta} marcada como fallida`, "error");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <p className="text-gray-500 dark:text-gray-400">Cargando rutas...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* 🟢 Encabezado con filtro y botón para agregar ruta */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de rutas
        </h1>

        <div className="flex items-center gap-4">
          {/* Dropdown de filtro */}
          <EstadoFilterDropdown
            opciones={filtroEstado.opciones}
            valorSeleccionado={filtroEstado.estadoSeleccionado}
            onCambio={(nuevoValor) =>
              filtroEstado.setEstadoSeleccionado(nuevoValor)
            }
          />

          {/* Botón verde de agregar */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-1" />
            {saving ? "Creando..." : "Agregar"}
          </button>
        </div>
      </div>

      {/* 🟠 Alerta de acciones */}
      {alert.show && (
        <Alert
          variant={alert.type}
          message={alert.message}
          className="mb-6"
          title=""
        />
      )}

      {/* 🟣 Mostrar secciones según el filtro seleccionado */}
      {filtroEstado.estadoSeleccionado === null ? (
        <>
          {renderSeccion(
            "Pendientes",
            "warning",
            todasLasRutas.filter((r) => r.estado_ruta === "Pendiente")
          )}
          {renderSeccion(
            "Asignadas",
            "info",
            todasLasRutas.filter((r) => r.estado_ruta === "Asignada")
          )}
          {renderSeccion(
            "Completadas",
            "success",
            todasLasRutas.filter((r) => r.estado_ruta === "Completada")
          )}
          {renderSeccion(
            "Fallidas",
            "destructive" as React.ComponentProps<typeof Badge>["color"],
            todasLasRutas.filter((r) => r.estado_ruta === "Fallida")
          )}
        </>
      ) : (
        <>
          {renderSeccion(
            filtroEstado.estadoSeleccionado,
            filtroEstado.estadoSeleccionado === "Pendiente"
              ? "warning"
              : filtroEstado.estadoSeleccionado === "Asignada"
              ? "info"
              : filtroEstado.estadoSeleccionado === "Completada"
              ? "success"
              : ("destructive" as React.ComponentProps<typeof Badge>["color"]),
            rutasFiltradas
          )}
        </>
      )}

      {/* ➕ Modal para agregar nueva ruta */}
      <ModalAgregarRuta
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(r: RutaFormData) => {
          // Convertimos RutaFormData a Ruta
          const nuevaRuta: Ruta = {
            id_ruta: Math.floor(Math.random() * 100000), // o el ID que devuelva tu backend
            estado_ruta: RutaEstado.Pendiente,
            fecha_inicio: r.horario.inicio,
            fecha_creacion: new Date().toISOString(),
            ...r,
          };

          setTodasLasRutas((prev) => [nuevaRuta, ...prev]);
          mostrarAlert("Ruta agregada correctamente", "success");
          setSaving(false);
        }}
        isLoading={saving}
      />
    </div>
  );
};

export default RouteManagement;*/
