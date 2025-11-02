// src/components/admin/packages/hooks/packagesHook.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { usePackages } from "../../../../hooks/admin/usePackages";
import {
  Paquete,
  PaquetesEstados,
  AsignarPaqueteDTO,
} from "../../../../global/types/paquete.types";
import {
  PAQUETES_COLUMNS,
  createPaqueteAction,
  PaquetesColumnKey,
  PaquetesActionKey,
  PaquetesActionCallbacks,
} from "../TablaPaquetes";
import type {
  ColumnDef,
  ActionButton,
} from "../../../../components/ui/table/DataTable";
import { useEstadoFilter } from "../../../../hooks/useEstadoFilter";
import {
  opcionesFiltorPaquetes,
  obtenerEstadoPaquete,
} from "../../../../global/config/filterConfigs";
import { toast } from "sonner";

//Interprete de react y backend

export function usePackagesManagementHook() {
  const navigate = useNavigate();

  // 🔹 Filtro por estado de paquete
  const filtroEstado = useEstadoFilter({
    opciones: opcionesFiltorPaquetes,
    valorInicial: null,
    obtenerEstado: obtenerEstadoPaquete,
  });

  // 🔹 Hook de paquetes (datos y operaciones CRUD)
  const {
    packages: data,
    loading,
    error,
    availableRoutes,
    fetchPackages: refetch,
    createPackage: createPaquete,
    updatePackage: updatePaquete,
    deletePackage: deletePaquete,
    assignPackageToRoute,
    reassignPackage,
    cancelAssignment,
    fetchAvailableRoutes,
  } = usePackages();

  const clearError = useCallback(() => {}, []);

  // 🔹 Contadores por estado (incluye 'todos')
  const contadores = useMemo(
    () => filtroEstado.contarPorEstado(data),
    [data, filtroEstado]
  );

  // 🔹 Estado de alertas
  const [alertState, setAlertState] = useState<{
    show: boolean;
    msg?: string;
    type?: "info" | "success" | "error" | "warning";
  }>({ show: false });

  const showAlert = useCallback(
    (msg: string, type: "info" | "success" | "error" | "warning" = "info") => {
      setAlertState({ show: true, msg, type });
      setTimeout(() => setAlertState({ show: false }), 4000);
    },
    []
  );

  // 🔹 Mostrar errores del backend automáticamente
  useEffect(() => {
    if (error) {
      console.error("❌ Error del backend:", error);
      showAlert(error, "error");
      setTimeout(() => clearError(), 4000);
    }
  }, [error, showAlert, clearError]);

  // 🔹 Modal de detalles
  const [modalDetalles, setModalDetalles] = useState<{
    open: boolean;
    paquete: Paquete | null;
  }>({ open: false, paquete: null });

  const abrirDetalles = useCallback((paquete: Paquete) => {
    setModalDetalles({ open: true, paquete });
  }, []);

  const cerrarDetalles = useCallback(() => {
    setModalDetalles({ open: false, paquete: null });
  }, []);

  // 🔹 Modal de edición
  const [modalEdicion, setModalEdicion] = useState<{
    open: boolean;
    paquete: Paquete | null;
    loading: boolean;
  }>({ open: false, paquete: null, loading: false });

  const abrirEdicion = useCallback(
    (paquete: Paquete) => {
      if (
        ![PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(
          paquete.estado
        )
      ) {
        showAlert(
          "Solo se pueden editar paquetes Pendientes o Fallidos",
          "warning"
        );
        return;
      }
      setModalEdicion({ open: true, paquete, loading: false });
    },
    [showAlert]
  );

  const cerrarEdicion = useCallback(() => {
    setModalEdicion({ open: false, paquete: null, loading: false });
  }, []);

  // ========== NUEVOS: MODALES DE ASIGNACIÓN ==========

  // 🔹 Modal de asignación a ruta
  const [modalAsignacion, setModalAsignacion] = useState<{
    open: boolean;
    paquete: Paquete | null;
    loading: boolean;
  }>({ open: false, paquete: null, loading: false });

  const abrirAsignacion = useCallback(
    async (paquete: Paquete) => {
      // Validar que esté en estado Pendiente
      if (paquete.estado !== PaquetesEstados.Pendiente) {
        showAlert(
          "Solo se pueden asignar paquetes en estado Pendiente",
          "warning"
        );
        return;
      }

      setModalAsignacion({ open: true, paquete, loading: true });
      
      try {
        // Cargar rutas disponibles al abrir el modal
        await fetchAvailableRoutes();
      } catch (error) {
        showAlert("Error al cargar rutas disponibles", "error");
      } finally {
        setModalAsignacion((prev) => ({ ...prev, loading: false }));
      }
    },
    [showAlert, fetchAvailableRoutes]
  );

  const cerrarAsignacion = useCallback(() => {
    setModalAsignacion({ open: false, paquete: null, loading: false });
  }, []);

  // 🔹 Modal de reasignación
  const [modalReasignacion, setModalReasignacion] = useState<{
    open: boolean;
    paquete: Paquete | null;
    loading: boolean;
  }>({ open: false, paquete: null, loading: false });

  const abrirReasignacion = useCallback(
    async (paquete: Paquete) => {
      // ✅ Array con solo Asignado
      if (![PaquetesEstados.Asignado].includes(paquete.estado)) {
        showAlert(
          "Solo se pueden reasignar paquetes en estado Asignado",
          "warning"
        );
        return;
      }

      setModalReasignacion({ open: true, paquete, loading: true });
      
      try {
        await fetchAvailableRoutes();
      } catch (error) {
        showAlert("Error al cargar rutas disponibles", "error");
      } finally {
        setModalReasignacion((prev) => ({ ...prev, loading: false }));
      }
    },
    [showAlert, fetchAvailableRoutes]
  );

  const cerrarReasignacion = useCallback(() => {
    setModalReasignacion({ open: false, paquete: null, loading: false });
  }, []);

  // ========== HANDLERS CRUD ==========

  const handleCreatePaquete = useCallback(
    async (payload: any) => {
      const ok = await createPaquete(payload);
      if (ok) {
        showAlert("Paquete creado correctamente", "success");
        await refetch();
      }
      return ok;
    },
    [createPaquete, refetch, showAlert]
  );

  const handleUpdatePaquete = useCallback(
    async (id: number, payload: any) => {
      const ok = await updatePaquete(id, payload);
      if (ok) {
        showAlert("Paquete actualizado correctamente", "success");
        await refetch();
      }
      return ok;
    },
    [updatePaquete, refetch, showAlert]
  );

  const handleDeletePaquete = useCallback(
    async (id: number) => {
      const ok = await deletePaquete(id);
      if (ok) {
        await refetch();
      }
      return ok;
    },
    [deletePaquete, refetch]
  );

  const handleDeleteWithConfirmation = useCallback(
    async (paquete: Paquete) => {
      const confirmar = window.confirm(
        `¿Estás seguro de que deseas eliminar el paquete #${paquete.id_paquete}? Esta acción no se puede deshacer.`
      );

      if (confirmar) {
        const success = await handleDeletePaquete(paquete.id_paquete);
        if (success) {
          toast.success("Paquete eliminado exitosamente");
        }
      }
    },
    [handleDeletePaquete]
  );

  const handleUpdateFromModal = useCallback(
    async (id: number, payload: Partial<Paquete>) => {
      setModalEdicion((prev) => ({ ...prev, loading: true }));
      const success = await handleUpdatePaquete(id, payload);
      setModalEdicion({ open: false, paquete: null, loading: false });
      return !!success;
    },
    [handleUpdatePaquete]
  );

  const handleTrack = useCallback(
    (id: number) => navigate(`/admin/monitoreo/${id}`),
    [navigate]
  );

  // ========== NUEVOS HANDLERS DE ASIGNACIÓN ==========

  // 🔹 Handler para asignar paquete a ruta
  // ✅ ACTUALIZADO: Ahora recibe cod_manifiesto en lugar de id_ruta
  const handleAssign = useCallback(
    async (paqueteId: number, dto: { cod_manifiesto: string }) => {
      setModalAsignacion((prev) => ({ ...prev, loading: true }));

      console.log('🎯 === PACKAGES HOOK - ASIGNAR ===');
      console.log('📦 Paquete ID:', paqueteId);
      console.log('📋 Código Manifiesto:', dto.cod_manifiesto);
      console.log('==================================');
      
      try {
        await assignPackageToRoute(paqueteId, dto);
        toast.success(
          `Paquete #${paqueteId} asignado correctamente a la ruta ${dto.cod_manifiesto}`
        );
        cerrarAsignacion();
        await refetch();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error al asignar paquete";
        console.error('❌ Error en handleAssign:', errorMsg);
        toast.error(errorMsg);
      } finally {
        setModalAsignacion((prev) => ({ ...prev, loading: false }));
      }
    },
    [assignPackageToRoute, cerrarAsignacion, refetch]
  );

  // 🔹 Handler para cancelar asignación
  const handleCancelAssignment = useCallback(
    async (paquete: Paquete) => {
      const confirmar = window.confirm(
        `¿Deseas cancelar la asignación del paquete #${paquete.id_paquete}? El paquete volverá a estado Pendiente.`
      );

      if (!confirmar) return;

      try {
        await cancelAssignment(paquete.id_paquete);
        toast.success("Asignación cancelada correctamente");
        await refetch();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error al cancelar asignación";
        toast.error(errorMsg);
      }
    },
    [cancelAssignment, refetch]
  );

  // 🔹 Handler para reasignar paquete
  // ✅ ACTUALIZADO: Ahora recibe cod_manifiesto en lugar de id_ruta
  const handleReassign = useCallback(
    async (paqueteId: number, dto: { cod_manifiesto: string }) => {
      setModalReasignacion((prev) => ({ ...prev, loading: true }));
      
      console.log('🔄 === PACKAGES HOOK - REASIGNAR ===');
      console.log('📦 Paquete ID:', paqueteId);
      console.log('📋 Código Manifiesto:', dto.cod_manifiesto);
      console.log('====================================');
      
      try {
        await reassignPackage(paqueteId, dto);
        toast.success(
          `Paquete #${paqueteId} reasignado correctamente a ${dto.cod_manifiesto}`
        );
        cerrarReasignacion();
        await refetch();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Error al reasignar paquete";
        console.error('❌ Error en handleReassign:', errorMsg);
        toast.error(errorMsg);
      } finally {
        setModalReasignacion((prev) => ({ ...prev, loading: false }));
      }
    },
    [reassignPackage, cerrarReasignacion, refetch]
  );

  // ========== HANDLERS DE CAMBIO DE ESTADO ==========

  const handleMarkEntregado = useCallback(
    async (paquete: Paquete) => {
      const ok = await handleUpdatePaquete(paquete.id_paquete, {
        estado: PaquetesEstados.Entregado,
        fecha_entrega: new Date().toISOString(),
      } as any);
      if (ok) {
        showAlert("Paquete marcado como Entregado", "success");
      }
    },
    [handleUpdatePaquete, showAlert]
  );

  const handleMarkFallido = useCallback(
    async (paquete: Paquete) => {
      const ok = await handleUpdatePaquete(paquete.id_paquete, {
        estado: PaquetesEstados.Fallido,
      } as any);
      if (ok) {
        showAlert("Paquete marcado como Fallido", "success");
      }
    },
    [handleUpdatePaquete, showAlert]
  );

  // 🔹 Acciones de la tabla
  const actionCallbacks: PaquetesActionCallbacks = useMemo(
    () => ({
      onView: abrirDetalles,
      onEdit: abrirEdicion,
      onDelete: handleDeleteWithConfirmation,
      onTrack: (p: Paquete) => handleTrack(p.id_paquete),
      onDownloadLabel: () =>
        showAlert("Descarga de etiqueta no implementada", "info"),
      onAssign: abrirAsignacion,
      onCancelAssignment: handleCancelAssignment,
      onReassign: abrirReasignacion,
      onMarkEntregado: handleMarkEntregado,
      onMarkFallido: handleMarkFallido,
    }),
    [
      abrirDetalles,
      abrirEdicion,
      handleDeleteWithConfirmation,
      handleTrack,
      showAlert,
      abrirAsignacion,
      handleCancelAssignment,
      abrirReasignacion,
      handleMarkEntregado,
      handleMarkFallido,
    ]
  );

  const getActionsForEstado = useCallback(
    (estado: PaquetesEstados): ActionButton<Paquete>[] => {
      const keys = ACTIONS_BY_ESTADO[estado];
      return keys.map((k) => createPaqueteAction(k, actionCallbacks));
    },
    [actionCallbacks]
  );

  // 🔹 Columnas y acciones
  const COLUMNS_FOR_ALL_STATES: PaquetesColumnKey[] = [
    "id_paquete",
    "destinatario",
    "fecha_registro",
    "fecha_entrega",
    "estado",
  ];

  const ACTIONS_BY_ESTADO: Record<PaquetesEstados, PaquetesActionKey[]> = {
    [PaquetesEstados.Pendiente]: ["view", "edit", "delete", "assign"],
    [PaquetesEstados.Asignado]: ["view", "cancel_assignment", "reassign"],
    [PaquetesEstados.Entregado]: ["view", "track"],
    [PaquetesEstados.Fallido]: ["view", "edit", "delete"],
  };

  const columnsForCurrentState: ColumnDef<Paquete>[] = useMemo(
    () => COLUMNS_FOR_ALL_STATES.map((k) => PAQUETES_COLUMNS[k]),
    []
  );

  const actionsForCurrentState: ActionButton<Paquete>[] = useMemo(() => {
    const estado: PaquetesEstados =
      filtroEstado.estadoSeleccionado ?? PaquetesEstados.Pendiente;
    const keys = ACTIONS_BY_ESTADO[estado];
    return keys.map((k) => createPaqueteAction(k, actionCallbacks));
  }, [filtroEstado.estadoSeleccionado, actionCallbacks]);

  // 🔹 Filtrado por estado
  const datosFiltrados = useMemo(() => {
    if (!filtroEstado.estadoSeleccionado) return data;
    return data.filter((p) => p.estado === filtroEstado.estadoSeleccionado);
  }, [data, filtroEstado.estadoSeleccionado]);

  return {
    data,
    datosFiltrados,
    loading,
    alertState,
    filtroEstado,
    contadores,
    columnsForCurrentState,
    actionsForCurrentState,
    getActionsForEstado,

    // Modales existentes
    modalDetalles,
    abrirDetalles,
    cerrarDetalles,
    modalEdicion,
    abrirEdicion,
    cerrarEdicion,
    handleUpdateFromModal,

    // Modales de asignación
    modalAsignacion,
    abrirAsignacion,
    cerrarAsignacion,
    modalReasignacion,
    abrirReasignacion,
    cerrarReasignacion,

    // Rutas disponibles
    availableRoutes,

    // Handlers CRUD
    handleCreatePaquete,
    handleUpdatePaquete,
    handleDeletePaquete,
    handleTrack,

    // ✅ Handlers de asignación actualizados
    handleAssign,
    handleCancelAssignment,
    handleReassign,
  };
}