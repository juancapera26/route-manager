// src/components/admin/packages/hooks/packagesHook.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { usePackages } from "../../../../hooks/admin/usePackages";
import {
  Paquete,
  PaquetesEstados,
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
    packages: data, // ← renombrar packages a data
    loading,
    error,
    fetchPackages: refetch, // ← renombrar fetchPackages a refetch
    createPackage: createPaquete, // ← renombrar createPackage a createPaquete
    updatePackage: updatePaquete, // ← renombrar updatePackage a updatePaquete
    deletePackage: deletePaquete, // ← renombrar deletePackage a deletePaquete
  } = usePackages();
  // Constante de clearError la quite de UsePackages ya que estaba generando error
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

  // 🔹 Handlers CRUD
  //Debo buscar cual es el tipo verdadero de payload--mientras es un any
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

  //Debo buscar cual es el tipo verdadero de payload--mientras es un any
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

  // ✅ NUEVO: Handler para eliminar con confirmación
  const handleDeleteWithConfirmation = useCallback(
    async (paquete: Paquete) => {
      const confirmar = window.confirm(
        `¿Estás seguro de que deseas eliminar el paquete #${paquete.id_paquete}?Esta acción no se puede deshacer.`
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
      return !!success; //Esto me retorna un booleano
    },
    [handleUpdatePaquete]
  );

  const handleTrack = useCallback(
    (id: number) => navigate(`/admin/monitoreo/${id}`),
    [navigate]
  );

  // 🔹 Callbacks stub para acciones futuras (AGREGAR ANTES DE actionCallbacks)
  const handleAssign = useCallback(
    (paquete: Paquete) => {
      showAlert("Función de asignación pendiente", "info");
    },
    [showAlert]
  );

  const handleCancelAssignment = useCallback(
    (paquete: Paquete) => {
      showAlert("Función de cancelar asignación pendiente", "info");
    },
    [showAlert]
  );

  const handleReassign = useCallback(
    (paquete: Paquete) => {
      showAlert("Función de reasignar pendiente", "info");
    },
    [showAlert]
  );

  const handleMarkEnRuta = useCallback(
    async (paquete: Paquete) => {
      const ok = await handleUpdatePaquete(paquete.id_paquete, {} as any); // ← Agregar 'as any' temporalmente
      if (ok) {
        showAlert("Paquete marcado como En Ruta", "success");
      }
    },
    [handleUpdatePaquete, showAlert]
  );

  const handleMarkEntregado = useCallback(
    async (paquete: Paquete) => {
      const ok = await handleUpdatePaquete(paquete.id_paquete, {
        estado: PaquetesEstados.Entregado,
        fecha_entrega: new Date().toISOString(),
      } as any); // ← Agregar 'as any' temporalmente
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
      } as any); // ← Agregar 'as any' temporalmente
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
      onDelete: handleDeleteWithConfirmation, // ✅ CAMBIADO: Ahora usa confirmación
      onTrack: (p: Paquete) => handleTrack(p.id_paquete),
      onDownloadLabel: () =>
        showAlert("Descarga de etiqueta no implementada", "info"),
      onAssign: handleAssign,
      onCancelAssignment: handleCancelAssignment,
      onReassign: handleReassign,
      onMarkEnRuta: handleMarkEnRuta,
      onMarkEntregado: handleMarkEntregado,
      onMarkFallido: handleMarkFallido,
    }),
    [
      abrirDetalles,
      abrirEdicion,
      handleDeleteWithConfirmation,
      handleTrack,
      showAlert,
      handleAssign,
      handleCancelAssignment,
      handleReassign,
      handleMarkEnRuta,
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
    [PaquetesEstados.Pendiente]: ["view", "edit", "delete"],
    [PaquetesEstados.Entregado]: ["view", "track"],
    [PaquetesEstados.Fallido]: ["view", "edit", "delete"],
    [PaquetesEstados.Asignado]: ["view"], // Temporal, ya que rutas no aplica
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

    // Modales
    modalDetalles,
    abrirDetalles,
    cerrarDetalles,
    modalEdicion,
    abrirEdicion,
    cerrarEdicion,
    handleUpdateFromModal,

    // Handlers CRUD
    handleCreatePaquete,
    handleUpdatePaquete,
    handleDeletePaquete,
    handleTrack,
  };
}
