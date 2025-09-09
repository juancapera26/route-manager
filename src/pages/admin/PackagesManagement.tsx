// src/pages/admin/PackagesManagement
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Importaciones de tipos y APIs
import {
  Paquete,
  PaquetesEstados,
  TipoPaquete,
  Ruta,
  Conductor,
} from "../../global/dataMock";
import {
  createPaquete,
  getPaquetes,
  assignPaquete,
  reassignPaquete,
  cancelPaqueteAssignment,
  deletePaquete,
  getRutas,
  getConductores,
} from "../../global/apis";

// Componentes UI
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import { Modal } from "../../components/ui/modal";
import ModalAgregarPaquete from "../../components/admin/ModalAgregarPaquete";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import Alert from "../../components/ui/alert/Alert";
import { Add } from "@mui/icons-material";

// Nuevas importaciones para el filtro
import { useEstadoFilter } from "../../hooks/useEstadoFilter";
import EstadoFilter from "../../components/common/EstadoFilter";
import {
  opcionesFiltorPaquetes,
  obtenerEstadoPaquete,
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
  paqueteId: string | null;
  action: "assign" | "reassign" | null;
}

const PackagesManagement: React.FC = () => {
  // Crear paquete

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false); // Bloquea el boton de agregar paquetes
  const handleAgregarPaquete = async (
    data: Omit<Paquete, "id_paquete" | "estado">
  ) => {
    setSaving(true);
    try {
      const nuevo = await createPaquete(data); // 👈 usa tu API simulada
      setTodosLosPaquetes((prev) => [nuevo, ...prev]);

      setIsModalOpen(false); // 👈 cerrar modal inmediatamente
      mostrarAlert("Paquete creado correctamente", "success"); // 👈 feedback
    } catch (error) {
      mostrarAlert("Error al crear el paquete", "error");
    } finally {
      setSaving(false); // 👈 vuelve a habilitar el botón
    }
  };

  // Estados principales
  const [todosLosPaquetes, setTodosLosPaquetes] = useState<Paquete[]>([]);
  const [rutasDisponibles, setRutasDisponibles] = useState<Ruta[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);

  // Hook del filtro - NUEVA FUNCIONALIDAD
  const filtroEstado = useEstadoFilter({
    opciones: opcionesFiltorPaquetes,
    valorInicial: null, // Mostrar todos por defecto
    obtenerEstado: obtenerEstadoPaquete,
  });

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    paqueteId: null,
    action: null,
  });
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });

  // Detalles de los paquetes
  const [detallesPaquete, setDetallesPaquete] = useState<Paquete | null>(null);
  const abrirModalDetalles = (paquete: Paquete) => setDetallesPaquete(paquete);
  const cerrarModalDetalles = () => setDetallesPaquete(null);

  const navigate = useNavigate();

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [allPaquetes, rutas, conductoresList] = await Promise.all([
        getPaquetes(),
        getRutas(),
        getConductores(),
      ]);

      setTodosLosPaquetes(allPaquetes);
      setRutasDisponibles(rutas);
      setConductores(conductoresList);
    } catch (error) {
      mostrarAlert("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar paquetes basado en el estado seleccionado
  const paquetesFiltrados = filtroEstado.filtrarPorEstado(todosLosPaquetes);

  // Separar por estados para mantener la funcionalidad existente
  const paquetesPendientes = paquetesFiltrados.filter(
    (p) => p.estado === PaquetesEstados.Pendiente
  );
  const paquetesAsignados = paquetesFiltrados.filter(
    (p) => p.estado === PaquetesEstados.Asignado
  );
  const paquetesEnRuta = paquetesFiltrados.filter(
    (p) => p.estado === PaquetesEstados.EnRuta
  );
  const paquetesEntregados = paquetesFiltrados.filter(
    (p) => p.estado === PaquetesEstados.Entregado
  );
  const paquetesFallidos = paquetesFiltrados.filter(
    (p) => p.estado === PaquetesEstados.Fallido
  );

  // Contadores para el filtro
  const contadores = filtroEstado.contarPorEstado(todosLosPaquetes);

  const mostrarAlert = (message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
  };

  // Funciones de gestión de paquetes (sin cambios)
  const handleEliminarPaquete = async (paqueteId: string) => {
    if (window.confirm("¿Estás seguro de eliminar este paquete?")) {
      try {
        const result = await deletePaquete(paqueteId);
        if (result.success) {
          mostrarAlert("Paquete eliminado correctamente", "success");
          cargarDatos();
        } else {
          mostrarAlert(result.message || "Error al eliminar", "error");
        }
      } catch (error) {
        mostrarAlert("Error al eliminar el paquete", "error");
      }
    }
  };

  const handleCancelarAsignacion = async (paqueteId: string) => {
    if (window.confirm("¿Cancelar la asignación de este paquete?")) {
      try {
        const paquete = [...paquetesAsignados, ...paquetesEnRuta].find(
          (p) => p.id_paquete === paqueteId
        );
        if (paquete && paquete.id_rutas_asignadas.length > 0) {
          const rutaId = paquete.id_rutas_asignadas[0];
          const success = await cancelPaqueteAssignment(paqueteId, rutaId);
          if (success) {
            mostrarAlert("Asignación cancelada correctamente", "success");
            cargarDatos();
          } else {
            mostrarAlert("Error al cancelar la asignación", "error");
          }
        }
      } catch (error) {
        mostrarAlert("Error al cancelar la asignación", "error");
      }
    }
  };

  const handleMonitorear = (paqueteId: string) => {
    navigate(`/admin/recuerdaTerminarlo/${paqueteId}`);
  };

  const abrirModalAsignacion = (
    paqueteId: string,
    action: "assign" | "reassign"
  ) => {
    setModalState({
      isOpen: true,
      paqueteId,
      action,
    });
  };

  const cerrarModal = () => {
    setModalState({
      isOpen: false,
      paqueteId: null,
      action: null,
    });
  };

  const handleConfirmarAsignacion = async (rutaId: string) => {
    if (!modalState.paqueteId) return;

    try {
      const ruta = rutasDisponibles.find((r) => r.id_ruta === rutaId);
      if (!ruta || !ruta.id_conductor_asignado) {
        mostrarAlert(
          "La ruta seleccionada no tiene conductor asignado",
          "error"
        );
        return;
      }

      let result: any;
      if (modalState.action === "assign") {
        result = await assignPaquete(
          modalState.paqueteId,
          rutaId,
          ruta.id_conductor_asignado
        );
      } else if (modalState.action === "reassign") {
        result = await reassignPaquete(
          modalState.paqueteId,
          rutaId,
          ruta.id_conductor_asignado
        );
      }

      if (result.success) {
        mostrarAlert(
          `Paquete ${
            modalState.action === "assign" ? "asignado" : "reasignado"
          } correctamente`,
          "success"
        );
        cargarDatos();
        cerrarModal();
      } else {
        mostrarAlert(result.message || "Error en la asignación", "error");
      }
    } catch (error) {
      mostrarAlert("Error en la operación", "error");
    }
  };

  // Componente para renderizar tabla de paquetes - MEJORADO
  const TablaPaquetes: React.FC<{
    paquetes: Paquete[];
    estado: PaquetesEstados;
  }> = ({ paquetes, estado }) => {
    if (paquetes.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 p-12">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              No hay paquetes en estado: {estado}
            </p>
          </div>
        </div>
      );
    }

    const getColorEstado = (estado: PaquetesEstados) => {
      switch (estado) {
        case PaquetesEstados.Pendiente:
          return "warning";
        case PaquetesEstados.Asignado:
          return "info";
        case PaquetesEstados.EnRuta:
          return "primary";
        case PaquetesEstados.Entregado:
          return "success";
        case PaquetesEstados.Fallido:
          return "error";
        default:
          return "light";
      }
    };

    const getColorTipo = (tipo: TipoPaquete) => {
      switch (tipo) {
        case TipoPaquete.Fragil:
          return "error";
        case TipoPaquete.Refrigerado:
          return "info";
        case TipoPaquete.Grande:
          return "warning";
        default:
          return "light";
      }
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
                  Ruta
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  Destinatario
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  Registro
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  Entrega
                </TableCell>
                <TableCell
                  isHeader
                  className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paquetes.map((paquete, index) => (
                <TableRow
                  key={paquete.id_paquete}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50/30 dark:bg-gray-800/50"
                  }`}
                >
                  <TableCell className="px-6 py-4">
                    <span className="flex items-center">
                      {paquete.id_paquete}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {paquete.id_conductor_asignado
                        ? (() => {
                            const c = conductores.find(
                              (x) =>
                                x.id_conductor === paquete.id_conductor_asignado
                            );
                            return c
                              ? `${c.nombre} ${c.apellido}`
                              : paquete.id_conductor_asignado;
                          })()
                        : "Sin asignar"}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-gray-300">
                      {paquete.id_rutas_asignadas.length
                        ? paquete.id_rutas_asignadas.join(", ")
                        : "Sin asignar"}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {paquete.destinatario.nombre}{" "}
                      {paquete.destinatario.apellido}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-gray-300">
                      {new Date(paquete.fecha_registro).toLocaleDateString(
                        "es-ES"
                      )}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-gray-300">
                      {paquete.fecha_entrega
                        ? new Date(paquete.fecha_entrega).toLocaleDateString(
                            "es-ES"
                          )
                        : "Pendiente"}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Botón Ver detalles - siempre presente */}
                      <button
                        onClick={() => abrirModalDetalles(paquete)}
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

                      {estado === PaquetesEstados.Pendiente && (
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
                            onClick={() =>
                              handleEliminarPaquete(paquete.id_paquete)
                            }
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

                          {/* Asignar */}
                          <Button
                            size="sm"
                            onClick={() =>
                              abrirModalAsignacion(paquete.id_paquete, "assign")
                            }
                            className="ml-2"
                          >
                            Asignar
                          </Button>
                        </>
                      )}

                      {estado === PaquetesEstados.Asignado && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-500/10"
                          onClick={() =>
                            handleCancelarAsignacion(paquete.id_paquete)
                          }
                        >
                          Cancelar
                        </Button>
                      )}

                      {estado === PaquetesEstados.EnRuta && (
                        <Button
                          size="sm"
                          onClick={() => handleMonitorear(paquete.id_paquete)}
                        >
                          Monitorear
                        </Button>
                      )}

                      {estado === PaquetesEstados.Fallido && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-500/10"
                          onClick={() =>
                            abrirModalAsignacion(paquete.id_paquete, "reassign")
                          }
                        >
                          Reasignar
                        </Button>
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

  // Modal de detalles MEJORADO
  const ModalDetalles: React.FC = () => (
    <Modal isOpen={!!detallesPaquete} onClose={cerrarModalDetalles}>
      {detallesPaquete && (
        <div className="p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Detalles del Paquete
            </h3>
            <Badge
              variant="light"
              color={
                detallesPaquete.estado === PaquetesEstados.Entregado
                  ? "success"
                  : detallesPaquete.estado === PaquetesEstados.Fallido
                  ? "error"
                  : detallesPaquete.estado === PaquetesEstados.EnRuta
                  ? "primary"
                  : detallesPaquete.estado === PaquetesEstados.Asignado
                  ? "info"
                  : "warning"
              }
            >
              {detallesPaquete.estado}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del paquete */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
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
                Información del Paquete
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ID:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.id_paquete}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tipo:
                  </span>
                  <Badge variant="light" size="sm">
                    {detallesPaquete.tipo_paquete}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Cantidad:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.cantidad}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Valor:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${detallesPaquete.valor_declarado.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Dimensiones y peso */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
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
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Dimensiones
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Largo:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.largo} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Ancho:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.ancho} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Alto:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.alto} cm
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Peso:
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.peso} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Información del destinatario */}
            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Información del Destinatario
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Nombre completo
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.nombre}{" "}
                    {detallesPaquete.destinatario.apellido}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Teléfono
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.telefono}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Correo electrónico
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.correo}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Dirección
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.direccion}
                  </p>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Fechas Importantes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Fecha de registro
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {new Date(
                      detallesPaquete.fecha_registro
                    ).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Fecha de entrega
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.fecha_entrega
                      ? new Date(
                          detallesPaquete.fecha_entrega
                        ).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Pendiente"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {detallesPaquete.estado === PaquetesEstados.Entregado && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Información de Entrega
              </h4>
              <div className="bg-green-50 dark:bg-green-500/10 rounded-lg p-4">
                <div className="mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Observación del conductor
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.observacion_conductor ||
                      "Sin observaciones"}
                  </p>
                </div>
                {detallesPaquete.imagen_adjunta && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                      Prueba de entrega
                    </span>
                    <img
                      src={"/public/images/evidence/evidence.jpg"}
                      alt="Prueba de entrega"
                      className="max-h-48 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {detallesPaquete.estado === PaquetesEstados.Fallido && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-error-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Información de Entrega
              </h4>
              <div className="bg-error-100 dark:bg-error-500/10 rounded-lg p-4">
                <div className="mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Observación del conductor
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.observacion_conductor ||
                      "Sin observaciones"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );

  // Modal para asignar rutas MEJORADO
  const ModalAsignarRuta: React.FC = () => (
    <Modal isOpen={modalState.isOpen} onClose={cerrarModal}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {modalState.action === "assign"
              ? "Asignar Paquete a Ruta"
              : "Reasignar Paquete"}
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
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50/30 dark:bg-gray-800/50"
                    }`}
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-blue-500 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {ruta.id_ruta}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(ruta.horario.inicio).toLocaleTimeString(
                            "es-ES",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        <span className="text-gray-400 mx-2">-</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(ruta.horario.fin).toLocaleTimeString(
                            "es-ES",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
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
                        variant={
                          !ruta.id_conductor_asignado ? "outline" : "primary"
                        }
                      >
                        {ruta.id_conductor_asignado
                          ? "Asignar ruta"
                          : "Sin conductor"}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Cargando paquetes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Título principal */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Gestión de paquetes
      </h1>

      {/* Alert - MOVIDO: Ahora aparece debajo del h1 */}
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

      {/* Renderizado condicional basado en el filtro */}
      {filtroEstado.estadoSeleccionado === null && (
        <>
          {/* Primera sección con filtro */}
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
                      {paquetesPendientes.length}
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

            <TablaPaquetes
              paquetes={paquetesPendientes}
              estado={PaquetesEstados.Pendiente}
            />
            <ModalAgregarPaquete
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleAgregarPaquete}
              isLoading={saving}
            />
          </section>

          {/* Resto de secciones SIN filtro */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Asignados
              </h2>
              <Badge variant="light" color="info">
                {paquetesAsignados.length}
              </Badge>
            </div>
            <TablaPaquetes
              paquetes={paquetesAsignados}
              estado={PaquetesEstados.Asignado}
            />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                En ruta
              </h2>
              <Badge variant="light" color="primary">
                {paquetesEnRuta.length}
              </Badge>
            </div>
            <TablaPaquetes
              paquetes={paquetesEnRuta}
              estado={PaquetesEstados.EnRuta}
            />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Entregados
              </h2>
              <Badge variant="light" color="success">
                {paquetesEntregados.length}
              </Badge>
            </div>
            <TablaPaquetes
              paquetes={paquetesEntregados}
              estado={PaquetesEstados.Entregado}
            />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Fallidos
              </h2>
              <Badge variant="light" color="error">
                {paquetesFallidos.length}
              </Badge>
            </div>
            <TablaPaquetes
              paquetes={paquetesFallidos}
              estado={PaquetesEstados.Fallido}
            />
          </section>
        </>
      )}

      {/* Para cuando SÍ HAY filtro específico (cualquier estado) */}
      {filtroEstado.estadoSeleccionado === PaquetesEstados.Pendiente && (
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
                    {paquetesPendientes.length}
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

          <TablaPaquetes
            paquetes={paquetesPendientes}
            estado={PaquetesEstados.Pendiente}
          />

          <ModalAgregarPaquete
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarPaquete}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === PaquetesEstados.Asignado && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              {/* Botón de agregar */}
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

              {/* Filtro y título */}
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Asignados
                  </h2>
                  <Badge variant="light" color="info">
                    {paquetesAsignados.length}
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

          <TablaPaquetes
            paquetes={paquetesAsignados}
            estado={PaquetesEstados.Asignado}
          />

          {/* Modal de agregar */}
          <ModalAgregarPaquete
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarPaquete}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === PaquetesEstados.EnRuta && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              {/* Botón de agregar */}
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

              {/* Filtro y título */}
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    En ruta
                  </h2>
                  <Badge variant="light" color="primary">
                    {paquetesEnRuta.length}
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

          <TablaPaquetes
            paquetes={paquetesEnRuta}
            estado={PaquetesEstados.EnRuta}
          />

          {/* Modal de agregar */}
          <ModalAgregarPaquete
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarPaquete}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === PaquetesEstados.Fallido && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              {/* Botón de agregar */}
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

              {/* Filtro y título */}
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Fallidos
                  </h2>
                  <Badge variant="light" color="error">
                    {paquetesFallidos.length}
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

          <TablaPaquetes
            paquetes={paquetesFallidos}
            estado={PaquetesEstados.Fallido}
          />

          {/* Modal de agregar */}
          <ModalAgregarPaquete
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarPaquete}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === PaquetesEstados.Entregado && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              {/* Botón de agregar */}
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

              {/* Filtro y título */}
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Entregados
                  </h2>
                  <Badge variant="light" color="success">
                    {paquetesEntregados.length}
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

          <TablaPaquetes
            paquetes={paquetesEntregados}
            estado={PaquetesEstados.Entregado}
          />

          {/* Modal de agregar */}
          <ModalAgregarPaquete
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarPaquete}
            isLoading={saving}
          />
        </section>
      )}

      {/* Modal de asignación y detalles */}
      <ModalAsignarRuta />
      <ModalDetalles />
    </div>
  );
};

export default PackagesManagement;