import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { RutaFormData } from "../../global/types/rutas";
import { ModalAgregarRuta } from "../../components/admin/routes/ModalAgregarRuta";
import { ModalAsignarConductor } from "../../components/admin/routes/ModalAsignarConductor";
import { ModalDetallesRuta } from "../../components/admin/routes/ModalDetallesRuta";
import TablaRutas from "../../components/admin/routes/TablaRutas"; // Nueva importación

// Importaciones de tipos y APIs
import {
  Ruta,
  RutaEstado,
  Conductor,
} from "../../global/types";
import {
    mockConductores,
  mockVehiculos,
} from "../../global/dataMock"
import {
  createRuta,
  getRutas,
  updateRuta,
  deleteRuta,
  asignarConductorARuta,
  cancelarAsignacionRuta,
  completarRuta,
  marcarRutaFallida,
} from "../../global/apiRoutes";

// Componentes UI
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import Alert from "../../components/ui/alert/Alert";
import { Add } from "@mui/icons-material";

// Nuevas importaciones para el filtro
import { useEstadoFilter } from "../../hooks/useEstadoFilter";
import {
  opcionesFiltroRutas,
  obtenerEstadoRuta,
} from "../../global/filterConfigs";
import EstadoFilterDropdown from "../../components/common/EstadoFilter";

// Interfaces locales
interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface ModalState {
  isOpen: boolean;
  rutaId: string | null;
  action: "assign" | "details" | null;
}

const RouteManagement: React.FC = () => {
  // Crear ruta
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false); // Bloquea el botón de agregar rutas

  const handleAgregarRuta = async (data: RutaFormData) => {
    setSaving(true);
    try {
      const nueva = await createRuta(data);
      setTodasLasRutas((prev) => [nueva, ...prev]);
      setIsModalOpen(false);
      mostrarAlert("Ruta creada correctamente", "success");
    } catch (error) {
      mostrarAlert("Error al crear la ruta", "error");
    } finally {
      setSaving(false);
    }
  };

  // Estados principales
  const [todasLasRutas, setTodasLasRutas] = useState<Ruta[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);

  // Hook del filtro
  const filtroEstado = useEstadoFilter({
    opciones: opcionesFiltroRutas,
    valorInicial: null,
    obtenerEstado: obtenerEstadoRuta,
  });

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    rutaId: null,
    action: null,
  });
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });

  // Detalles de las rutas
  const [detallesRuta, setDetallesRuta] = useState<Ruta | null>(null);

  const navigate = useNavigate();

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const allRutas = await getRutas();
      setTodasLasRutas(allRutas);
      setConductores(mockConductores); // Simulación de getConductores
    } catch (error) {
      mostrarAlert("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar rutas basado en el estado seleccionado
  const rutasFiltradas = filtroEstado.filtrarPorEstado(todasLasRutas);

  // Separar por estados
  const rutasPendientes = rutasFiltradas.filter(
    (r) => r.estado === RutaEstado.Pendiente
  );
  const rutasAsignadas = rutasFiltradas.filter(
    (r) => r.estado === RutaEstado.Asignada
  );
  const rutasCompletadas = rutasFiltradas.filter(
    (r) => r.estado === RutaEstado.Completada
  );
  const rutasFallidas = rutasFiltradas.filter(
    (r) => r.estado === RutaEstado.Fallida
  );

  // Contadores para el filtro
  const contadores = filtroEstado.contarPorEstado(todasLasRutas);

  const mostrarAlert = (message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
  };

  // Funciones de gestión de rutas
  const handleEliminarRuta = async (rutaId: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta ruta?")) {
      try {
        const result = await deleteRuta(rutaId);
        if (result.success) {
          mostrarAlert("Ruta eliminada correctamente", "success");
          cargarDatos();
        } else {
          mostrarAlert(result.message || "Error al eliminar", "error");
        }
      } catch (error) {
        mostrarAlert("Error al eliminar la ruta", "error");
      }
    }
  };

  const handleCancelarAsignacion = async (rutaId: string) => {
    if (
      window.confirm(
        "¿Seguro crack que desea cancelar la asignación de esta ruta?"
      )
    ) {
      try {
        const result = await cancelarAsignacionRuta(rutaId);
        if (result.success) {
          mostrarAlert("Asignación cancelada correctamente", "success");
          cargarDatos();
        } else {
          mostrarAlert(
            result.message || "Error al cancelar la asignación",
            "error"
          );
        }
      } catch (error) {
        mostrarAlert("Error al cancelar la asignación", "error");
      }
    }
  };

  const handleCompletarRuta = async (rutaId: string) => {
    if (window.confirm("¿Completar esta ruta?")) {
      try {
        const result = await completarRuta(rutaId);
        if (result.success) {
          mostrarAlert("Ruta completada correctamente", "success");
          cargarDatos();
        } else {
          mostrarAlert(result.message || "Error al completar", "error");
        }
      } catch (error) {
        mostrarAlert("Error al completar la ruta", "error");
      }
    }
  };

  const handleMarcarFallida = async (rutaId: string) => {
    if (window.confirm("¿Marcar esta ruta como fallida?")) {
      try {
        const result = await marcarRutaFallida(rutaId);
        if (result.success) {
          mostrarAlert("Ruta marcada como fallida", "success");
          cargarDatos();
        } else {
          mostrarAlert(result.message || "Error al marcar", "error");
        }
      } catch (error) {
        mostrarAlert("Error al marcar la ruta como fallida", "error");
      }
    }
  };

  const abrirModal = (rutaId: string, action: "assign" | "details") => {
    setModalState({
      isOpen: true,
      rutaId,
      action,
    });
    if (action === "details") {
      const ruta = todasLasRutas.find((r) => r.id_ruta === rutaId);
      setDetallesRuta(ruta || null);
    }
  };

  const cerrarModal = () => {
    setModalState({
      isOpen: false,
      rutaId: null,
      action: null,
    });
    setDetallesRuta(null);
  };

  const handleConfirmarAsignacion = async (conductorId: string) => {
    if (!modalState.rutaId) return;

    try {
      const result = await asignarConductorARuta(
        modalState.rutaId,
        conductorId
      );
      if (result.success) {
        mostrarAlert("Conductor asignado correctamente", "success");
        cargarDatos();
        cerrarModal();
      } else {
        mostrarAlert(result.message || "Error en la asignación", "error");
      }
    } catch (error) {
      mostrarAlert("Error en la operación", "error");
    }
  };

  // Handler para editar (placeholder, puedes implementar modal)
  const handleEditarRuta = (rutaId: string) => {
    mostrarAlert(
      "Recordatorio: Implementar modal de edición para ruta " + rutaId,
      "info"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Cargando rutas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Gestión de rutas
      </h1>

      {alert.show && (
        <Alert
          variant={alert.type}
          title={
            alert.type === "success"
              ? "Éxito"
              : alert.type === "error"
              ? "Error"
              : alert.type === "warning"
              ? "Advertencia"
              : "Información"
          }
          message={alert.message}
          className="mb-6"
        />
      )}

      {/* Para cuando NO HAY filtro (mostrar todos) */}
      {filtroEstado.estadoSeleccionado === null && (
        <>
          <section>
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
                <div className="order-1 sm:order-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={saving}
                    className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                  >
                    <Add className="w-4 h-4" />
                    {saving ? "Creando..." : ""}
                  </button>
                </div>

                <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                      Pendientes
                    </h2>
                    <Badge variant="light" color="warning">
                      {rutasPendientes.length}
                    </Badge>
                  </div>

                  <div>
                    <EstadoFilterDropdown
                      opciones={filtroEstado.opciones}
                      valorSeleccionado={filtroEstado.estadoSeleccionado}
                      onCambio={filtroEstado.setEstadoSeleccionado}
                      contadores={contadores}
                    />
                  </div>
                </div>
              </div>
            </div>

            <TablaRutas
              rutas={rutasPendientes}
              estado={RutaEstado.Pendiente}
              conductores={conductores}
              onAbrirModal={abrirModal}
              onEliminarRuta={handleEliminarRuta}
              onCancelarAsignacion={handleCancelarAsignacion}
              onCompletarRuta={handleCompletarRuta}
              onMarcarFallida={handleMarcarFallida}
              onEditarRuta={handleEditarRuta}
            />
            <ModalAgregarRuta
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleAgregarRuta}
              isLoading={saving}
            />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Asignadas
              </h2>
              <Badge variant="light" color="info">
                {rutasAsignadas.length}
              </Badge>
            </div>
            <TablaRutas
              rutas={rutasAsignadas}
              estado={RutaEstado.Asignada}
              conductores={conductores}
              onAbrirModal={abrirModal}
              onEliminarRuta={handleEliminarRuta}
              onCancelarAsignacion={handleCancelarAsignacion}
              onCompletarRuta={handleCompletarRuta}
              onMarcarFallida={handleMarcarFallida}
              onEditarRuta={handleEditarRuta}
            />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Completadas
              </h2>
              <Badge variant="light" color="success">
                {rutasCompletadas.length}
              </Badge>
            </div>
            <TablaRutas
              rutas={rutasCompletadas}
              estado={RutaEstado.Completada}
              conductores={conductores}
              onAbrirModal={abrirModal}
              onEliminarRuta={handleEliminarRuta}
              onCancelarAsignacion={handleCancelarAsignacion}
              onCompletarRuta={handleCompletarRuta}
              onMarcarFallida={handleMarcarFallida}
              onEditarRuta={handleEditarRuta}
            />
          </section>
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Fallidas
              </h2>
              <Badge variant="light" color="error">
                {rutasFallidas.length}
              </Badge>
            </div>
            <TablaRutas
              rutas={rutasFallidas}
              estado={RutaEstado.Fallida}
              conductores={conductores}
              onAbrirModal={abrirModal}
              onEliminarRuta={handleEliminarRuta}
              onCancelarAsignacion={handleCancelarAsignacion}
              onCompletarRuta={handleCompletarRuta}
              onMarcarFallida={handleMarcarFallida}
              onEditarRuta={handleEditarRuta}
            />
          </section>
        </>
      )}

      {/* Para cuando SÍ HAY filtro específico (cualquier estado) */}
      {filtroEstado.estadoSeleccionado === RutaEstado.Pendiente && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Add className="w-4 h-4" />
                  {saving ? "Creando..." : ""}
                </button>
              </div>
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Pendientes
                  </h2>
                  <Badge variant="light" color="warning">
                    {rutasPendientes.length}
                  </Badge>
                </div>
                <div>
                  <EstadoFilterDropdown
                    opciones={filtroEstado.opciones}
                    valorSeleccionado={filtroEstado.estadoSeleccionado}
                    onCambio={filtroEstado.setEstadoSeleccionado}
                    contadores={contadores}
                  />
                </div>
              </div>
            </div>
          </div>
          <TablaRutas
            rutas={rutasPendientes}
            estado={RutaEstado.Pendiente}
            conductores={conductores}
            onAbrirModal={abrirModal}
            onEliminarRuta={handleEliminarRuta}
            onCancelarAsignacion={handleCancelarAsignacion}
            onCompletarRuta={handleCompletarRuta}
            onMarcarFallida={handleMarcarFallida}
            onEditarRuta={handleEditarRuta}
          />
          <ModalAgregarRuta
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarRuta}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === RutaEstado.Asignada && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Add className="w-4 h-4" />
                  {saving ? "Creando..." : ""}
                </button>
              </div>
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Asignadas
                  </h2>
                  <Badge variant="light" color="info">
                    {rutasAsignadas.length}
                  </Badge>
                </div>
                <div>
                  <EstadoFilterDropdown
                    opciones={filtroEstado.opciones}
                    valorSeleccionado={filtroEstado.estadoSeleccionado}
                    onCambio={filtroEstado.setEstadoSeleccionado}
                    contadores={contadores}
                  />
                </div>
              </div>
            </div>
          </div>
          <TablaRutas
            rutas={rutasAsignadas}
            estado={RutaEstado.Asignada}
            conductores={conductores}
            onAbrirModal={abrirModal}
            onEliminarRuta={handleEliminarRuta}
            onCancelarAsignacion={handleCancelarAsignacion}
            onCompletarRuta={handleCompletarRuta}
            onMarcarFallida={handleMarcarFallida}
            onEditarRuta={handleEditarRuta}
          />
          <ModalAgregarRuta
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarRuta}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === RutaEstado.Completada && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Add className="w-4 h-4" />
                  {saving ? "Creando..." : ""}
                </button>
              </div>
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Completadas
                  </h2>
                  <Badge variant="light" color="success">
                    {rutasCompletadas.length}
                  </Badge>
                </div>
                <div>
                  <EstadoFilterDropdown
                    opciones={filtroEstado.opciones}
                    valorSeleccionado={filtroEstado.estadoSeleccionado}
                    onCambio={filtroEstado.setEstadoSeleccionado}
                    contadores={contadores}
                  />
                </div>
              </div>
            </div>
          </div>
          <TablaRutas
            rutas={rutasCompletadas}
            estado={RutaEstado.Completada}
            conductores={conductores}
            onAbrirModal={abrirModal}
            onEliminarRuta={handleEliminarRuta}
            onCancelarAsignacion={handleCancelarAsignacion}
            onCompletarRuta={handleCompletarRuta}
            onMarcarFallida={handleMarcarFallida}
            onEditarRuta={handleEditarRuta}
          />
          <ModalAgregarRuta
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarRuta}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === RutaEstado.Fallida && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Add className="w-4 h-4" />
                  {saving ? "Creando..." : ""}
                </button>
              </div>
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Fallidas
                  </h2>
                  <Badge variant="light" color="error">
                    {rutasFallidas.length}
                  </Badge>
                </div>
                <div>
                  <EstadoFilterDropdown
                    opciones={filtroEstado.opciones}
                    valorSeleccionado={filtroEstado.estadoSeleccionado}
                    onCambio={filtroEstado.setEstadoSeleccionado}
                    contadores={contadores}
                  />
                </div>
              </div>
            </div>
          </div>
          <TablaRutas
            rutas={rutasFallidas}
            estado={RutaEstado.Fallida}
            conductores={conductores}
            onAbrirModal={abrirModal}
            onEliminarRuta={handleEliminarRuta}
            onCancelarAsignacion={handleCancelarAsignacion}
            onCompletarRuta={handleCompletarRuta}
            onMarcarFallida={handleMarcarFallida}
            onEditarRuta={handleEditarRuta}
          />

          <ModalAgregarRuta
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarRuta}
            isLoading={saving}
          />
        </section>
      )}

      {/* Modal de asignación y detalles */}
      <ModalAsignarConductor
        isOpen={modalState.isOpen && modalState.action === "assign"}
        onClose={cerrarModal}
        onConfirm={handleConfirmarAsignacion} // 👈 Tu función ya existente
        conductores={mockConductores}
        vehiculos={mockVehiculos} // 👈 Solo falta esta constante
        titulo="Asignar Conductor a Ruta"
      />
      <ModalDetallesRuta
        isOpen={modalState.isOpen && modalState.action === "details"}
        onClose={cerrarModal}
        ruta={detallesRuta}
      />
    </div>
  );
};

export default RouteManagement;
