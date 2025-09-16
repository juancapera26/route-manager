// src/pages/admin/PackagesHooks.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";

import { Paquete, PaquetesEstados } from "../../../../global/types";
import { usePaquetes } from "../../../../hooks/admin/usePackages";

import {
  PAQUETES_COLUMNS,
  createPaqueteAction,
  PaquetesColumnKey,
  PaquetesActionKey,
  PaquetesActionCallbacks,
} from "../../../../global/types/tableTypes";

import type {
  ColumnDef,
  ActionButton,
} from "../../../../components/ui/table/DataTable";

import { useEstadoFilter } from "../../../../hooks/useEstadoFilter";
import {
  opcionesFiltorPaquetes,
  obtenerEstadoPaquete,
} from "../../../../global/filterConfigs";

/**
 * Hook: lógica del módulo PackagesManagement (sin UI)
 */
export function usePackagesManagementHook() {
  const navigate = useNavigate();

  // -------------------------
  // Filtro de estado (estadoSeleccionado = null | PaquetesEstados)
  // -------------------------
  const filtroEstado = useEstadoFilter({
    opciones: opcionesFiltorPaquetes,
    valorInicial: null,
    obtenerEstado: obtenerEstadoPaquete,
  });

  // -------------------------
  // Hook central de datos y operaciones (tu fuente única)
  // ✅ CAMBIADO: Siempre obtenemos TODOS los datos, no filtramos aquí
  // -------------------------
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
  } = usePaquetes({
    estado: "all", // ✅ FIJO: Siempre obtenemos todos los datos
    autoFetch: true,
  });

  // ✅ ELIMINADO: No sincronizamos filtro con el hook de datos
  // El filtrado se hace localmente en este hook

  // -------------------------
  // Estado local útil para lógica (modals/alerts)
  // -------------------------
  const [alertState, setAlertState] = useState<{
    show: boolean;
    msg?: string;
    type?: "info" | "success" | "error" | "warning";
  }>({ show: false });
  const showAlert = useCallback(
    (msg: string, type: "info" | "success" | "error" | "warning" = "info") => {
      setAlertState({ show: true, msg, type });
      setTimeout(() => setAlertState({ show: false }), 3500);
    },
    []
  );

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    paqueteId: string | null;
    action: "assign" | "reassign" | null;
  }>({
    isOpen: false,
    paqueteId: null,
    action: null,
  });

  const openAssignModal = useCallback(
    (paqueteId: string, action: "assign" | "reassign") => {
      setModalState({ isOpen: true, paqueteId, action });
    },
    []
  );
  const closeAssignModal = useCallback(
    () => setModalState({ isOpen: false, paqueteId: null, action: null }),
    []
  );

  // -------------------------
  // Handlers de operaciones (lógica)
  // -------------------------
  const handleCreatePaquete = useCallback(
    async (payload: Parameters<typeof createPaquete>[0]) => {
      const ok = await createPaquete(payload as any);
      if (ok) {
        showAlert("Paquete creado", "success");
        await refetch();
      } else {
        showAlert("Error creando paquete", "error");
      }
      return ok;
    },
    [createPaquete, refetch, showAlert]
  );

  const handleUpdatePaquete = useCallback(
    async (id: string, changes: Partial<Paquete>) => {
      const ok = await updatePaquete(id, changes);
      if (ok) {
        showAlert("Paquete actualizado", "success");
        await refetch();
      } else {
        showAlert("Error al actualizar", "error");
      }
      return ok;
    },
    [updatePaquete, refetch, showAlert]
  );

  const handleDeletePaquete = useCallback(
    async (id: string) => {
      const ok = await deletePaquete(id);
      if (ok) {
        showAlert("Paquete eliminado", "success");
        await refetch();
      } else {
        showAlert("Error al eliminar", "error");
      }
      return ok;
    },
    [deletePaquete, refetch, showAlert]
  );

  const handleCancelAssignment = useCallback(
    async (paqueteId: string) => {
      const p = data.find((d) => d.id_paquete === paqueteId);
      if (!p || !p.id_rutas_asignadas?.length) {
        showAlert("No hay ruta asignada", "error");
        return false;
      }
      const ok = await cancelAssignment(paqueteId, p.id_rutas_asignadas[0]);
      ok
        ? (showAlert("Asignación cancelada", "success"), refetch())
        : showAlert("Error al cancelar", "error");
      return ok;
    },
    [data, cancelAssignment, refetch, showAlert]
  );

  const handleConfirmAssign = useCallback(
    async (rutaId: string, conductorId?: string) => {
      if (!modalState.paqueteId) {
        showAlert("No hay paquete seleccionado", "error");
        return false;
      }
      const ok =
        modalState.action === "assign"
          ? await assignPaquete(modalState.paqueteId, rutaId, conductorId)
          : await reassignPaquete(modalState.paqueteId, rutaId, conductorId);

      if (ok) {
        showAlert(
          modalState.action === "assign"
            ? "Asignado correctamente"
            : "Reasignado correctamente",
          "success"
        );
        await refetch();
        closeAssignModal();
      } else {
        showAlert("Error en asignación", "error");
      }
      return ok;
    },
    [
      modalState,
      assignPaquete,
      reassignPaquete,
      refetch,
      showAlert,
      closeAssignModal,
    ]
  );

  const handleMarkEnRuta = useCallback(
    async (id: string) => {
      const ok = await markEnRuta(id);
      ok
        ? (showAlert("Paquete en ruta", "success"), refetch())
        : showAlert("Error al actualizar", "error");
      return ok;
    },
    [markEnRuta, refetch, showAlert]
  );

  const handleMarkEntregado = useCallback(
    async (id: string) => {
      const ok = await markEntregado(id);
      ok
        ? (showAlert("Paquete entregado", "success"), refetch())
        : showAlert("Error al actualizar", "error");
      return ok;
    },
    [markEntregado, refetch, showAlert]
  );

  const handleMarkFallido = useCallback(
    async (id: string) => {
      const ok = await markFallido(id);
      ok
        ? (showAlert("Paquete marcado como fallido", "success"), refetch())
        : showAlert("Error al actualizar", "error");
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

  // -------------------------
  // ACTION CALLBACKS (completo: incluye onDownloadLabel)
  // -------------------------
  const actionCallbacks: PaquetesActionCallbacks = useMemo(
    () => ({
      onView: (p: Paquete) => {
        showAlert(`Ver ${p.id_paquete}`, "info");
      },
      onEdit: (p: Paquete) => {
        showAlert("Edición en desarrollo", "info");
      },
      onDelete: (p: Paquete) => {
        void handleDeletePaquete(p.id_paquete);
      },
      onAssign: (p: Paquete) => {
        openAssignModal(p.id_paquete, "assign");
      },
      onCancelAssignment: (p: Paquete) => {
        void handleCancelAssignment(p.id_paquete);
      },
      onReassign: (p: Paquete) => {
        openAssignModal(p.id_paquete, "reassign");
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
      handleDeletePaquete,
      openAssignModal,
      handleCancelAssignment,
      handleMarkEnRuta,
      handleMarkEntregado,
      handleMarkFallido,
      handleTrack,
      showAlert,
    ]
  );

  // ==================== COLUMNAS SIMPLIFICADAS PARA TODAS LAS VISTAS ====================
  const COLUMNS_FOR_ALL_STATES: PaquetesColumnKey[] = [
    "id_paquete",
    "conductor_nombre",
    "ruta_asignada",
    "destinatario",
    "fecha_registro",
    "fecha_entrega",
    "estado",
  ];

  // ==================== ACCIONES POR ESTADO - CORREGIDO ====================
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
    ], // ❌ REMOVIDO cancel_assignment de aquí
    [PaquetesEstados.Entregado]: ["view", "track"],
    [PaquetesEstados.Fallido]: ["view", "edit", "delete", "reassign"],
  };

  // ==================== TODAS LAS ACCIONES POSIBLES (para vista "todos") ====================
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
    "track"
  ];

  // ==================== COLUMNAS Y ACCIONES COMPUTADAS - CORREGIDO ====================
  const columnsForCurrentState: ColumnDef<Paquete>[] = useMemo(
    () => COLUMNS_FOR_ALL_STATES.map((k) => PAQUETES_COLUMNS[k]),
    [] // Sin dependencias variables
  );

  // ✅ SOLUCION PRINCIPAL: Lógica de acciones corregida
  const actionsForCurrentState: ActionButton<Paquete>[] = useMemo(() => {
    let keys: PaquetesActionKey[];
    
    if (filtroEstado.estadoSeleccionado === null) {
      // ✅ Cuando mostramos "todos", incluimos todas las acciones posibles
      // La visibilidad por fila se maneja en createPaqueteAction via la propiedad 'visible'
      keys = ALL_POSSIBLE_ACTIONS;
    } else {
      // ✅ Cuando filtramos por estado, solo acciones específicas
      const estado = filtroEstado.estadoSeleccionado;
      keys = ACTIONS_BY_ESTADO[estado] ?? ACTIONS_BY_ESTADO[PaquetesEstados.Pendiente];
    }
    
    // ✅ Crear las acciones - la visibilidad per-fila está definida en tableTypes.ts
    return keys.map(k => createPaqueteAction(k, actionCallbacks));
  }, [filtroEstado.estadoSeleccionado, actionCallbacks]);

  // -------------------------
  // ✅ NUEVO: Filtrado local de datos (no en el hook de datos)
  // Esto nos permite mantener todos los contadores correctos
  // -------------------------
  const datosFiltrados = useMemo(() => {
    // Si no hay filtro seleccionado, mostrar todos
    if (!filtroEstado.estadoSeleccionado) {
      return data;
    }
    
    // Si hay filtro, filtrar localmente por estado
    return data.filter(paquete => paquete.estado === filtroEstado.estadoSeleccionado);
  }, [data, filtroEstado.estadoSeleccionado]);

  // ✅ CONTADORES: Ahora siempre basados en todos los datos (data completo)
  const contadores = useMemo(
    () => ({
      todos: data.length, // Total siempre correcto
      [PaquetesEstados.Pendiente]: paquetesPendientes.length,
      [PaquetesEstados.Asignado]: paquetesAsignados.length,
      [PaquetesEstados.EnRuta]: paquetesEnRuta.length,
      [PaquetesEstados.Entregado]: paquetesEntregados.length,
      [PaquetesEstados.Fallido]: paquetesFallidos.length,
    }),
    [
      data, // Siempre basado en data completo
      paquetesPendientes,
      paquetesAsignados,
      paquetesEnRuta,
      paquetesEntregados,
      paquetesFallidos,
    ]
  );

  // -------------------------
  // Export: lo que necesita el componente que renderice
  // -------------------------
  return {
    // datos / estados
    data,
    datosFiltrados,
    loading,
    error,
    refetch,
    contadores,
    columnsForCurrentState,
    actionsForCurrentState,

    // filtros y UI-less state
    filtroEstado,
    alertState,
    modalState,

    // handlers lógicos
    openAssignModal,
    closeAssignModal,
    handleConfirmAssign,
    handleCreatePaquete,
    handleDeletePaquete,
    handleCancelAssignment,
    handleMarkEnRuta,
    handleMarkEntregado,
    handleMarkFallido,
    handleTrack,
  };
}