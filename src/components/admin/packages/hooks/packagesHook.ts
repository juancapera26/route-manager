// src/components/admin/packages/hooks/packagesHook.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { Paquete, PaquetesEstados, Ruta } from "../../../../global/types";
import { usePaquetes } from "../../../../hooks/admin/usePackages";
import { useRutas } from "../../../../hooks/admin/useRoutes";
import {
  PAQUETES_COLUMNS,
  createPaqueteAction,
  PaquetesColumnKey,
  PaquetesActionKey,
  PaquetesActionCallbacks,
} from "../TablaPaquetes";
import type { ColumnDef, ActionButton } from "../../../../components/ui/table/DataTable";
import { useEstadoFilter } from "../../../../hooks/useEstadoFilter";
import { opcionesFiltorPaquetes, obtenerEstadoPaquete } from "../../../../global/config/filterConfigs";

export function usePackagesManagementHook() {
  const navigate = useNavigate();
  
  // Filtro de estado
  const filtroEstado = useEstadoFilter({
    opciones: opcionesFiltorPaquetes,
    valorInicial: null,
    obtenerEstado: obtenerEstadoPaquete,
  });

  // Hook central de datos de paquetes
  const {
    data,
    loading,
    error,
    refetch,
    paquetesPendientes,
    paquetesAsignados,
    paquetesEnRuta,
    paquetesEntregados,
    paquetesFallidos,
    createPaquete,
    updatePaquete,
    deletePaquete,
    assignPaquete,
    cancelAssignment,
    reassignPaquete,
    markEnRuta,
    markEntregado,
    markFallido,
    updateFilters,
    clearError,
  } = usePaquetes({
    estado: "all",
    autoFetch: true,
  });

  // Hook de rutas para el modal de asignación
  const { 
    rutasPendientes, 
    rutasAsignadas,
    loading: rutasLoading,
    error: rutasError,
    refetch: refetchRutas,
  } = useRutas({
    estado: 'all',
    autoFetch: true,
  });

  // Estado local para modals/alerts
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

  // Efecto para mostrar errores de la API
  useEffect(() => {
    if (error) {
      console.log('Error detectado del API paquetes:', error);
      showAlert(error, "error");
      setTimeout(() => {
        console.log('Limpiando error automáticamente');
        clearError();
      }, 4500);
    }
  }, [error, showAlert, clearError]);

  // Estado para modal de asignación de rutas
  const [modalAsignacionState, setModalAsignacionState] = useState<{
    isOpen: boolean;
    paqueteId: string | null;
    action: 'assign' | 'reassign' | null;
  }>({
    isOpen: false,
    paqueteId: null,
    action: null,
  });

  // Estado para modal de detalles
  const [modalDetallesState, setModalDetallesState] = useState<{
    isOpen: boolean;
    paquete: Paquete | null;
  }>({
    isOpen: false,
    paquete: null,
  });

  // NUEVO: Estado para modal de edición
  const [modalEdicionState, setModalEdicionState] = useState<{
    isOpen: boolean;
    paquete: Paquete | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    paquete: null,
    isLoading: false,
  });

  // Funciones para manejar modal de asignación
  const abrirModalAsignacion = useCallback((paqueteId: string, action: 'assign' | 'reassign') => {
    console.log('Abriendo modal de asignación:', { paqueteId, action });
    setModalAsignacionState({
      isOpen: true,
      paqueteId,
      action,
    });
    refetchRutas();
  }, [refetchRutas]);

  const cerrarModalAsignacion = useCallback(() => {
    console.log('Cerrando modal de asignación');
    setModalAsignacionState({
      isOpen: false,
      paqueteId: null,
      action: null,
    });
  }, []);

  // Lógica para obtener rutas disponibles para asignación
  const rutasDisponiblesParaAsignacion = useMemo(() => {
    const rutasConConductor = rutasAsignadas.filter(ruta => 
      ruta.id_conductor_asignado && ruta.paquetes_asignados.length < 10
    );
    
    return [...rutasPendientes, ...rutasConConductor]
      .sort((a, b) => {
        if (a.id_conductor_asignado && !b.id_conductor_asignado) return -1;
        if (!a.id_conductor_asignado && b.id_conductor_asignado) return 1;
        return 0;
      });
  }, [rutasPendientes, rutasAsignadas]);

  // Handler para confirmar asignación de ruta
  const handleConfirmarAsignacionRuta = useCallback(
    async (rutaId: string) => {
      if (!modalAsignacionState.paqueteId) {
        showAlert("No hay paquete seleccionado para asignar", "warning");
        return false;
      }

      console.log('🎯 Confirmando asignación:', {
        paqueteId: modalAsignacionState.paqueteId,
        rutaId,
        action: modalAsignacionState.action,
      });

      const ok = modalAsignacionState.action === "assign"
        ? await assignPaquete(modalAsignacionState.paqueteId, rutaId)
        : await reassignPaquete(modalAsignacionState.paqueteId, rutaId);

      if (ok) {
        showAlert(
          modalAsignacionState.action === "assign"
            ? "Paquete asignado a ruta correctamente"
            : "Paquete reasignado a ruta correctamente",
          "success"
        );
        await Promise.all([refetch(), refetchRutas()]);
        cerrarModalAsignacion();
      }
      return ok;
    },
    [
      modalAsignacionState,
      assignPaquete,
      reassignPaquete,
      refetch,
      refetchRutas,
      showAlert,
      cerrarModalAsignacion,
    ]
  );

  // Funciones para modal de detalles
  const abrirModalDetalles = useCallback((paquete: Paquete) => {
    console.log('🔍 Abriendo modal de detalles para:', paquete.id_paquete);
    setModalDetallesState({
      isOpen: true,
      paquete: paquete,
    });
  }, []);

  const cerrarModalDetalles = useCallback(() => {
    console.log('❌ Cerrando modal de detalles');
    setModalDetallesState({
      isOpen: false,
      paquete: null,
    });
  }, []);

  // NUEVO: Funciones para modal de edición
  const abrirModalEdicion = useCallback((paquete: Paquete) => {
    console.log('✏️ Abriendo modal de edición para:', paquete.id_paquete);
    
    // Verificar que el paquete puede ser editado (solo pendientes y fallidos)
    if (![PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(paquete.estado)) {
      showAlert("Solo se pueden editar paquetes en estado Pendiente o Fallido", "warning");
      return;
    }

    setModalEdicionState({
      isOpen: true,
      paquete: paquete,
      isLoading: false,
    });
  }, [showAlert]);

  const cerrarModalEdicion = useCallback(() => {
    console.log('❌ Cerrando modal de edición');
    setModalEdicionState({
      isOpen: false,
      paquete: null,
      isLoading: false,
    });
  }, []);

  const handleUpdatePaqueteFromModal = useCallback(
    async (id: string, payload: Partial<Paquete>) => {
      console.log('📝 Iniciando actualización de paquete:', { id, payload });
      
      // Activar estado de carga
      setModalEdicionState(prev => ({
        ...prev,
        isLoading: true,
      }));

      try {
        const success = await updatePaquete(id, payload);
        
        if (success) {
          console.log('✅ Paquete actualizado exitosamente');
          showAlert("Paquete actualizado exitosamente", "success");
          await refetch(); // Recargar datos
        } else {
          console.log('❌ Error al actualizar paquete');
          showAlert("Error al actualizar el paquete", "error");
        }

        return success;
      } catch (error) {
        console.error('❌ Excepción al actualizar paquete:', error);
        showAlert("Error inesperado al actualizar el paquete", "error");
        return false;
      } finally {
        // Desactivar estado de carga
        setModalEdicionState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    },
    [updatePaquete, refetch, showAlert]
  );

  // Handlers de operaciones existentes
  const handleCreatePaquete = useCallback(
    async (payload: Parameters<typeof createPaquete>[0]) => {
      const ok = await createPaquete(payload as any);
      if (ok) {
        showAlert("Paquete creado correctamente", "success");
        await refetch();
      }
      return ok;
    },
    [createPaquete, refetch, showAlert]
  );

  const handleUpdatePaquete = useCallback(
    async (id: string, changes: Partial<Paquete>) => {
      const ok = await updatePaquete(id, changes);
      if (ok) {
        showAlert("Paquete actualizado correctamente", "success");
        await refetch();
      }
      return ok;
    },
    [updatePaquete, refetch, showAlert]
  );

  const handleDeletePaquete = useCallback(
    async (id: string) => {
      console.log('🗑️ Iniciando eliminación del paquete:', id);
      const ok = await deletePaquete(id);
      console.log('🗑️ Resultado de eliminación:', ok);
      if (ok) {
        showAlert("Paquete eliminado correctamente", "success");
        await refetch();
      }
      return ok;
    },
    [deletePaquete, refetch, showAlert]
  );

  const handleCancelAssignment = useCallback(
    async (paqueteId: string) => {
      const p = data.find((d) => d.id_paquete === paqueteId);
      if (!p || !p.id_rutas_asignadas?.length) {
        showAlert("No hay ruta asignada para cancelar", "warning");
        return false;
      }
      const ok = await cancelAssignment(paqueteId, p.id_rutas_asignadas[0]);
      if (ok) {
        showAlert("Asignación cancelada correctamente", "success");
        await Promise.all([refetch(), refetchRutas()]);
      }
      return ok;
    },
    [data, cancelAssignment, refetch, refetchRutas, showAlert]
  );

  const handleMarkEnRuta = useCallback(
    async (id: string) => {
      const ok = await markEnRuta(id);
      if (ok) {
        showAlert("Paquete marcado como en ruta", "success");
        await refetch();
      }
      return ok;
    },
    [markEnRuta, refetch, showAlert]
  );

  const handleMarkEntregado = useCallback(
    async (id: string) => {
      const ok = await markEntregado(id);
      if (ok) {
        showAlert("Paquete marcado como entregado", "success");
        await refetch();
      }
      return ok;
    },
    [markEntregado, refetch, showAlert]
  );

  const handleMarkFallido = useCallback(
    async (id: string) => {
      const ok = await markFallido(id);
      if (ok) {
        showAlert("Paquete marcado como fallido", "success");
        await refetch();
      }
      return ok;
    },
    [markFallido, refetch, showAlert]
  );

  const handleTrack = useCallback(
    (id: string) => {
      navigate(`/admin/monitoreo/${id}`);
    },
    [navigate]
  );

  // Action callbacks ACTUALIZADOS con el nuevo modal de edición
  const actionCallbacks: PaquetesActionCallbacks = useMemo(
    () => ({
      onView: (paquete: Paquete) => {
        abrirModalDetalles(paquete);
      },
      // ACTUALIZADO: Usa el nuevo modal de edición
      onEdit: (paquete: Paquete) => {
        abrirModalEdicion(paquete);
      },
      onDelete: (p: Paquete) => {
        void handleDeletePaquete(p.id_paquete);
      },
      onAssign: (p: Paquete) => {
        abrirModalAsignacion(p.id_paquete, "assign");
      },
      onCancelAssignment: (p: Paquete) => {
        void handleCancelAssignment(p.id_paquete);
      },
      onReassign: (p: Paquete) => {
        abrirModalAsignacion(p.id_paquete, "reassign");
      },
      onMarkEnRuta: (p: Paquete) => {
        void handleMarkEnRuta(p.id_paquete);
      },
      onMarkEntregado: (p: Paquete) => {
        void handleMarkEntregado(p.id_paquete);
      },
      onMarkFallido: (p: Paquete) => {
        void handleMarkFallido(p.id_paquete);
      },
      onDownloadLabel: (p: Paquete) => {
        showAlert("Descarga de etiqueta no implementada", "info");
      },
      onTrack: (p: Paquete) => {
        handleTrack(p.id_paquete);
      },
    }),
    [
      abrirModalDetalles,
      abrirModalEdicion, // NUEVO
      handleDeletePaquete,
      abrirModalAsignacion,
      handleCancelAssignment,
      handleMarkEnRuta,
      handleMarkEntregado,
      handleMarkFallido,
      handleTrack,
      showAlert,
    ]
  );

  // Columnas y acciones (sin cambios)
  const COLUMNS_FOR_ALL_STATES: PaquetesColumnKey[] = [
    "id_paquete",
    "conductor_nombre",
    "ruta_asignada",
    "destinatario",
    "fecha_registro",
    "fecha_entrega",
    "estado",
  ];

  const ACTIONS_BY_ESTADO: Record<PaquetesEstados, PaquetesActionKey[]> = {
    [PaquetesEstados.Pendiente]: ["view", "edit", "delete", "assign"],
    [PaquetesEstados.Asignado]: [
      "view",
      "cancel_assignment",
      "mark_en_ruta",
      "mark_fallido",
    ],
    [PaquetesEstados.EnRuta]: [
      "view",
      "mark_entregado",
      "mark_fallido",
      "track",
    ],
    [PaquetesEstados.Entregado]: ["view", "track"],
    [PaquetesEstados.Fallido]: ["view", "edit", "delete", "reassign"],
  };

  const ALL_POSSIBLE_ACTIONS: PaquetesActionKey[] = [
    "view",
    "edit",
    "delete",
    "assign",
    "cancel_assignment",
    "reassign",
    "mark_en_ruta",
    "mark_entregado",
    "mark_fallido",
    "track",
  ];

  const columnsForCurrentState: ColumnDef<Paquete>[] = useMemo(
    () => COLUMNS_FOR_ALL_STATES.map((k) => PAQUETES_COLUMNS[k]),
    []
  );

  const actionsForCurrentState: ActionButton<Paquete>[] = useMemo(() => {
    let keys: PaquetesActionKey[];
    if (filtroEstado.estadoSeleccionado === null) {
      keys = ALL_POSSIBLE_ACTIONS;
    } else {
      keys =
        ACTIONS_BY_ESTADO[filtroEstado.estadoSeleccionado] ??
        ACTIONS_BY_ESTADO[PaquetesEstados.Pendiente];
    }
    return keys.map((k) => createPaqueteAction(k, actionCallbacks));
  }, [filtroEstado.estadoSeleccionado, actionCallbacks]);

  // Filtrado local
  const datosFiltrados = useMemo(() => {
    if (!filtroEstado.estadoSeleccionado) {
      return data;
    }
    return data.filter(
      (paquete) => paquete.estado === filtroEstado.estadoSeleccionado
    );
  }, [data, filtroEstado.estadoSeleccionado]);

  // Contadores
  const contadores = useMemo(
    () => ({
      todos: data.length,
      [PaquetesEstados.Pendiente]: paquetesPendientes.length,
      [PaquetesEstados.Asignado]: paquetesAsignados.length,
      [PaquetesEstados.EnRuta]: paquetesEnRuta.length,
      [PaquetesEstados.Entregado]: paquetesEntregados.length,
      [PaquetesEstados.Fallido]: paquetesFallidos.length,
    }),
    [
      data,
      paquetesPendientes,
      paquetesAsignados,
      paquetesEnRuta,
      paquetesEntregados,
      paquetesFallidos,
    ]
  );

  // RETORNO ACTUALIZADO con nuevos estados y funciones
  return {
    data,
    datosFiltrados,
    loading: loading || rutasLoading,
    error,
    refetch,
    contadores,
    columnsForCurrentState,
    actionsForCurrentState,
    filtroEstado,
    alertState,
    
    // Funciones de operaciones
    handleCreatePaquete,
    handleDeletePaquete,
    handleCancelAssignment,
    handleMarkEnRuta,
    handleMarkEntregado,
    handleMarkFallido,
    handleTrack,
    
    // Listas filtradas
    paquetesPendientes,
    paquetesAsignados,
    paquetesEnRuta,
    paquetesEntregados,
    paquetesFallidos,
    
    // Modal de detalles
    modalDetallesState,
    abrirModalDetalles,
    cerrarModalDetalles,
    
    // Modal de asignación
    modalAsignacionState,
    rutasDisponiblesParaAsignacion,
    abrirModalAsignacion,
    cerrarModalAsignacion,
    handleConfirmarAsignacionRuta,
    
    // NUEVO: Modal de edición
    modalEdicionState,
    abrirModalEdicion,
    cerrarModalEdicion,
    handleUpdatePaqueteFromModal,
  };
}