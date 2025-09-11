// src/pages/admin/RouteManagement
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Importaciones de tipos y APIs
import {
  Ruta,
  RutaEstado,
  ZonaRuta,
  Conductor,
  ConductorEstado,
} from "../../global/dataMock";
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import Alert from "../../components/ui/alert/Alert";
import LocationOffIcon from '@mui/icons-material/LocationOff';
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

interface RutaFormData {
  zona: ZonaRuta;
  horario: { inicio: string; fin: string };
  puntos_entrega: string;
}

// Mock conductores para simular getConductores
const mockConductores: Conductor[] = [
  {
    id_conductor: "CON-001",
    nombre: "Juan",
    apellido: "Pérez",
    estado: ConductorEstado.Disponible,
    correo: "juan.perez@ejemplo.com",
    nombre_empresa: "Logística XYZ",
    telefono: "300-555-1234",
    tipo_documento: "CC",
    documento: "12345678",
  },
  {
    id_conductor: "CON-002",
    nombre: "María",
    apellido: "Gómez",
    estado: ConductorEstado.Disponible,
    correo: "maria.gomez@ejemplo.com",
    nombre_empresa: "Logística XYZ",
    telefono: "300-555-5678",
    tipo_documento: "CC",
    documento: "87654321",
  },
];

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
    (r) => r.estado === RutaEstado.asignada
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

  // Componente para renderizar tabla de rutas
  const TablaRutas: React.FC<{
    rutas: Ruta[];
    estado: RutaEstado;
  }> = ({ rutas, estado }) => {
    if (rutas.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 p-12">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <LocationOffIcon className="text-gray-500 dark:text-gray-400"></LocationOffIcon>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No hay rutas en estado: {estado}
            </p>
          </div>
        </div>
      );
    }

    const getColorEstado = (estado: RutaEstado) => {
      switch (estado) {
        case RutaEstado.Pendiente:
          return "warning";
        case RutaEstado.asignada:
          return "info";
        case RutaEstado.Completada:
          return "success";
        case RutaEstado.Fallida:
          return "error";
        default:
          return "light";
      }
    };

    const getConductorNombre = (id: string | null) => {
      if (!id) return "Sin asignar";
      const conductor = conductores.find((c) => c.id_conductor === id);
      return conductor
        ? `${conductor.nombre} ${conductor.apellido}`
        : "Desconocido";
    };

    const formatHorario = (horario: { inicio: string; fin: string }) => {
      const inicioTime = new Date(horario.inicio).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const finTime = new Date(horario.fin).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${inicioTime} - ${finTime}`;
    };

    const formatFecha = (fecha: string) => {
      return new Date(fecha).toLocaleDateString();
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-700">
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  ID Paquete
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  Conductor
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  Paquetes
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  Zona
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  Horario
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  Registro
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>

            {/** Debo tener en cuenta como hacer esto */}
            <TableBody>
              {rutas.map((ruta, index) => (
                <TableRow
                  key={ruta.id_ruta}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50/30 dark:bg-gray-800/50"
                  }`}
                >
                  <TableCell className="px-6 py-4">
                    <span className="flex items-center">{ruta.id_ruta}</span>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {getConductorNombre(ruta.id_conductor_asignado)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-gray-300">
                      {ruta.paquetes_asignados.length}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-gray-300"></span>
                    {ruta.zona}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-gray-300">
                      {formatHorario(ruta.horario)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {formatFecha(ruta.fecha_registro)}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Botón Ver detalles - siempre presente */}
                      <button
                        onClick={() => abrirModal(ruta.id_ruta, "details")}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>

                      {ruta.estado === RutaEstado.Pendiente && (
                        <>
                          {/* Editar */}
                          <button
                            onClick={() =>
                              mostrarAlert(
                                "Recordatorio: Debo cambiar esta alerta por un modal mas adelante",
                                "info"
                              )
                            }
                            className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Editar paquete"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          {/* Eliminar */}
                          <button
                            onClick={() => handleEliminarRuta(ruta.id_ruta)}
                            className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Eliminar paquete"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>

                          {/* Asignar un conductor */}
                          <Button
                            size="sm"
                            onClick={() => abrirModal(ruta.id_ruta, "assign")}
                          >
                            Asignar Conductor
                          </Button>
                        </>
                      )}

                      {ruta.estado === RutaEstado.asignada && (
                        <>
                          {/** Completar y fallar en realidad no dependen del administrador, es un ejemplo */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-500/10"
                            onClick={() => handleCompletarRuta(ruta.id_ruta)}
                          >
                            Completar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-500/10"
                            onClick={() => handleMarcarFallida(ruta.id_ruta)}
                          >
                            Fallar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-500/10"
                            onClick={() =>
                              handleCancelarAsignacion(ruta.id_ruta)
                            }
                          >
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  // Componente para modal de agregar ruta
  const ModalAgregarRuta: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: RutaFormData) => void;
    isLoading: boolean;
  }> = ({ isOpen, onClose, onSuccess, isLoading }) => {
    const [formData, setFormData] = useState<RutaFormData>({
      zona: ZonaRuta.Norte,
      horario: { inicio: "", fin: "" },
      puntos_entrega: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSuccess(formData);
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-99999 animate-in fade-in-0 duration-300">
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative w-[80vw] max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="mx-auto"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Agregar Nueva Ruta
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Zona
              </label>
              <select
                value={formData.zona}
                onChange={(e) =>
                  setFormData({ ...formData, zona: e.target.value as ZonaRuta })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {Object.values(ZonaRuta).map((zona) => (
                  <option key={zona} value={zona}>
                    {zona}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Horario Inicio
              </label>
              <input
                type="datetime-local"
                value={formData.horario.inicio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    horario: { ...formData.horario, inicio: e.target.value },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Horario Fin
              </label>
              <input
                type="datetime-local"
                value={formData.horario.fin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    horario: { ...formData.horario, fin: e.target.value },
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Puntos de Entrega
              </label>
              <textarea
                value={formData.puntos_entrega}
                onChange={(e) =>
                  setFormData({ ...formData, puntos_entrega: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                rows={4}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full bg-success-500 hover:bg-success-600 text-white"
            >
              {isLoading ? "Creando..." : "Crear Ruta"}
            </Button>
          </form>
        </div>
      </div>
    );
  };

  // Componente para modal de asignar conductor
  const ModalAsignarConductor: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (conductorId: string) => void;
  }> = ({ isOpen, onClose, onConfirm }) => {
    const [selectedConductor, setSelectedConductor] = useState<string>("");

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-99999 animate-in fade-in-0 duration-300">
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative w-[80vw] max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="mx-auto"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Asignar Conductor
            </h2>
            <select
              value={selectedConductor}
              onChange={(e) => setSelectedConductor(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Seleccionar conductor</option>
              {conductores
                .filter((c) => c.estado === ConductorEstado.Disponible)
                .map((conductor) => (
                  <option
                    key={conductor.id_conductor}
                    value={conductor.id_conductor}
                  >
                    {conductor.nombre} {conductor.apellido}
                  </option>
                ))}
            </select>
            <Button
              variant="primary"
              disabled={!selectedConductor}
              onClick={() => onConfirm(selectedConductor)}
              className="w-full bg-success-500 hover:bg-success-600 text-white"
            >
              Asignar
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Componente para modal de detalles de ruta
  const ModalDetallesRuta: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    ruta: Ruta | null;
  }> = ({ isOpen, onClose, ruta }) => {
    if (!isOpen || !ruta) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-99999 animate-in fade-in-0 duration-300">
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        ></div>
        <div className="relative w-[80vw] max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 h-10 w-10 rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="mx-auto"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Detalles de la Ruta {ruta.id_ruta}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <p>
                <strong>Zona:</strong> {ruta.zona}
              </p>
              <p>
                <strong>Horario:</strong>{" "}
                {new Date(ruta.horario.inicio).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(ruta.horario.fin).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Fecha Registro:</strong>{" "}
                {new Date(ruta.fecha_registro).toLocaleDateString()}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <Badge variant="light" color={getColorEstado(ruta.estado)}>
                  {ruta.estado}
                </Badge>
              </p>
              <p>
                <strong>Conductor:</strong>{" "}
                {ruta.id_conductor_asignado
                  ? getConductorNombre(ruta.id_conductor_asignado)
                  : "Sin asignar"}
              </p>
              <p>
                <strong>Puntos de Entrega:</strong> {ruta.puntos_entrega}
              </p>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Paquetes Asignados
            </h3>
            {ruta.paquetes_asignados.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No hay paquetes asignados a esta ruta.
              </p>
            ) : (
              <div className="space-y-2">
                {ruta.paquetes_asignados.map((paqueteId) => (
                  <div
                    key={paqueteId}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <p>
                      <strong>ID Paquete:</strong> {paqueteId}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Información de paquete no disponible en este contexto.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getColorEstado = (estado: RutaEstado) => {
    switch (estado) {
      case RutaEstado.Pendiente:
        return "warning";
      case RutaEstado.asignada:
        return "info";
      case RutaEstado.Completada:
        return "success";
      case RutaEstado.Fallida:
        return "error";
      default:
        return "light";
    }
  };

  const getConductorNombre = (id: string | null) => {
    if (!id) return "Sin asignar";
    const conductor = conductores.find((c) => c.id_conductor === id);
    return conductor
      ? `${conductor.nombre} ${conductor.apellido}`
      : "Desconocido";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Cargando rutas...
          </p>
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

            <TablaRutas rutas={rutasPendientes} estado={RutaEstado.Pendiente} />
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
            <TablaRutas rutas={rutasAsignadas} estado={RutaEstado.asignada} />
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
            <TablaRutas rutas={rutasFallidas} estado={RutaEstado.Fallida} />
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
          <TablaRutas rutas={rutasPendientes} estado={RutaEstado.Pendiente} />
          <ModalAgregarRuta
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarRuta}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === RutaEstado.asignada && (
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
          <TablaRutas rutas={rutasAsignadas} estado={RutaEstado.asignada} />
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
          <TablaRutas rutas={rutasCompletadas} estado={RutaEstado.Completada} />
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
          <TablaRutas rutas={rutasFallidas} estado={RutaEstado.Fallida} />
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
        onConfirm={handleConfirmarAsignacion}
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
