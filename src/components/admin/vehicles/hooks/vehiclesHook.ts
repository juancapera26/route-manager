// src/components/admin/vehicles/hooks/vehiclesHook.ts
import { useState, useCallback, useMemo } from 'react';
import { Vehiculo, CreateVehiculoDto, UpdateVehiculoDto, EstadoVehiculo } from '../../../../global/types/vehiclesType';
import { useVehicles } from '../../../../hooks/admin/useVehicles';

interface UseVehiclesManagementReturn {
  // Datos
  vehiculos: Vehiculo[];
  vehiculosDisponibles: Vehiculo[];
  vehiculosNoDisponibles: Vehiculo[];
  loading: boolean;
  error: string | null;

  // Estados de modales
  modalAgregarState: {
    isOpen: boolean;
    isLoading: boolean;
  };
  modalDetallesState: {
    isOpen: boolean;
    vehiculo: Vehiculo | null;
  };
  modalEditarState: {
    isOpen: boolean;
    vehiculo: Vehiculo | null;
    isLoading: boolean;
  };

  // Estado de alertas
  alertState: {
    show: boolean;
    msg?: string;
    type?: 'info' | 'success' | 'error' | 'warning';
  };

  // Funciones de modales
  abrirModalAgregar: () => void;
  cerrarModalAgregar: () => void;
  abrirModalDetalles: (vehiculo: Vehiculo) => void;
  cerrarModalDetalles: () => void;
  abrirModalEditar: (vehiculo: Vehiculo) => void;
  cerrarModalEditar: () => void;

  // Operaciones CRUD
  handleCreateVehiculo: (data: CreateVehiculoDto) => Promise<boolean>;
  handleUpdateVehiculo: (id: string, data: UpdateVehiculoDto) => Promise<boolean>;
  handleDeleteVehiculo: (id: string) => Promise<void>;
  handleCambiarEstado: (id: string, disponible: boolean) => Promise<void>;

  // Utilidades
  refetch: () => Promise<void>;
}

export const useVehiclesManagement = (): UseVehiclesManagementReturn => {
  // Hook principal de vehículos
  const {
    data: vehiculos,
    vehiculosDisponibles,
    vehiculosNoDisponibles,
    loading,
    error,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    cambiarEstado,
    refetch,
    clearError,
  } = useVehicles({ autoFetch: true });

  // Estados de modales
  const [modalAgregarState, setModalAgregarState] = useState({
    isOpen: false,
    isLoading: false,
  });

  const [modalDetallesState, setModalDetallesState] = useState<{
    isOpen: boolean;
    vehiculo: Vehiculo | null;
  }>({
    isOpen: false,
    vehiculo: null,
  });

  const [modalEditarState, setModalEditarState] = useState<{
    isOpen: boolean;
    vehiculo: Vehiculo | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    vehiculo: null,
    isLoading: false,
  });

  // Estado de alertas
  const [alertState, setAlertState] = useState<{
    show: boolean;
    msg?: string;
    type?: 'info' | 'success' | 'error' | 'warning';
  }>({ show: false });

  /**
   * Mostrar alerta temporal
   */
  const showAlert = useCallback(
    (msg: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
      setAlertState({ show: true, msg, type });
      setTimeout(() => {
        setAlertState({ show: false });
        clearError();
      }, 4000);
    },
    [clearError]
  );

  // ==================== FUNCIONES DE MODALES ====================

  /**
   * Abrir modal de agregar
   */
  const abrirModalAgregar = useCallback(() => {
    console.log('📝 Abriendo modal de agregar vehículo');
    setModalAgregarState({ isOpen: true, isLoading: false });
  }, []);

  /**
   * Cerrar modal de agregar
   */
  const cerrarModalAgregar = useCallback(() => {
    console.log('❌ Cerrando modal de agregar vehículo');
    setModalAgregarState({ isOpen: false, isLoading: false });
  }, []);

  /**
   * Abrir modal de detalles
   */
  const abrirModalDetalles = useCallback((vehiculo: Vehiculo) => {
    console.log('🔍 Abriendo modal de detalles para:', vehiculo.id_vehiculo);
    setModalDetallesState({
      isOpen: true,
      vehiculo: vehiculo,
    });
  }, []);

  /**
   * Cerrar modal de detalles
   */
  const cerrarModalDetalles = useCallback(() => {
    console.log('❌ Cerrando modal de detalles');
    setModalDetallesState({
      isOpen: false,
      vehiculo: null,
    });
  }, []);

  /**
   * Abrir modal de editar
   */
  const abrirModalEditar = useCallback((vehiculo: Vehiculo) => {
    console.log('✏️ Abriendo modal de editar para:', vehiculo.id_vehiculo);
    setModalEditarState({
      isOpen: true,
      vehiculo: vehiculo,
      isLoading: false,
    });
  }, []);

  /**
   * Cerrar modal de editar
   */
  const cerrarModalEditar = useCallback(() => {
    console.log('❌ Cerrando modal de editar');
    setModalEditarState({
      isOpen: false,
      vehiculo: null,
      isLoading: false,
    });
  }, []);

  // ==================== OPERACIONES CRUD ====================

  /**
   * Crear un nuevo vehículo
   */
  const handleCreateVehiculo = useCallback(
    async (data: CreateVehiculoDto): Promise<boolean> => {
      console.log('➕ Creando vehículo:', data);
      setModalAgregarState((prev) => ({ ...prev, isLoading: true }));

      try {
        const success = await createVehiculo(data);

        if (success) {
          showAlert('Vehículo creado exitosamente', 'success');
          await refetch();
          return true;
        } else {
          showAlert('Error al crear vehículo', 'error');
          return false;
        }
      } catch (err) {
        console.error('Error en handleCreateVehiculo:', err);
        showAlert('Error inesperado al crear vehículo', 'error');
        return false;
      } finally {
        setModalAgregarState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [createVehiculo, refetch, showAlert]
  );

  /**
   * Actualizar un vehículo existente
   */
  const handleUpdateVehiculo = useCallback(
    async (id: string, data: UpdateVehiculoDto): Promise<boolean> => {
      console.log('📝 Actualizando vehículo:', { id, data });
      setModalEditarState((prev) => ({ ...prev, isLoading: true }));

      try {
        const success = await updateVehiculo(id, data);

        if (success) {
          showAlert('Vehículo actualizado exitosamente', 'success');
          await refetch();
          return true;
        } else {
          showAlert('Error al actualizar vehículo', 'error');
          return false;
        }
      } catch (err) {
        console.error('Error en handleUpdateVehiculo:', err);
        showAlert('Error inesperado al actualizar vehículo', 'error');
        return false;
      } finally {
        setModalEditarState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [updateVehiculo, refetch, showAlert]
  );

  /**
   * Eliminar un vehículo
   */
  const handleDeleteVehiculo = useCallback(
    async (id: string): Promise<void> => {
      console.log('🗑️ Eliminando vehículo:', id);

      const confirmar = window.confirm(
        '¿Estás seguro de que deseas eliminar este vehículo?\n\nEsta acción no se puede deshacer.'
      );

      if (!confirmar) {
        console.log('❌ Eliminación cancelada por el usuario');
        return;
      }

      try {
        const success = await deleteVehiculo(id);

        if (success) {
          showAlert('Vehículo eliminado exitosamente', 'success');
          await refetch();
        } else {
          showAlert('Error al eliminar vehículo', 'error');
        }
      } catch (err) {
        console.error('Error en handleDeleteVehiculo:', err);
        showAlert('Error inesperado al eliminar vehículo', 'error');
      }
    },
    [deleteVehiculo, refetch, showAlert]
  );

  /**
   * Cambiar estado de disponibilidad
   */
  const handleCambiarEstado = useCallback(
    async (id: string, disponible: boolean): Promise<void> => {
      console.log('🔄 Cambiando estado del vehículo:', { id, disponible });

      const estadoTexto = disponible ? 'disponible' : 'no disponible';
      const confirmar = window.confirm(
        `¿Deseas marcar este vehículo como ${estadoTexto}?`
      );

      if (!confirmar) {
        console.log('❌ Cambio de estado cancelado por el usuario');
        return;
      }

      try {
        const success = await cambiarEstado(id, disponible);

        if (success) {
          showAlert(
            `Vehículo marcado como ${estadoTexto} exitosamente`,
            'success'
          );
          await refetch();
        } else {
          showAlert('Error al cambiar estado del vehículo', 'error');
        }
      } catch (err) {
        console.error('Error en handleCambiarEstado:', err);
        showAlert('Error inesperado al cambiar estado', 'error');
      }
    },
    [cambiarEstado, refetch, showAlert]
  );

  return {
    // Datos
    vehiculos,
    vehiculosDisponibles,
    vehiculosNoDisponibles,
    loading,
    error,

    // Estados de modales
    modalAgregarState,
    modalDetallesState,
    modalEditarState,

    // Estado de alertas
    alertState,

    // Funciones de modales
    abrirModalAgregar,
    cerrarModalAgregar,
    abrirModalDetalles,
    cerrarModalDetalles,
    abrirModalEditar,
    cerrarModalEditar,

    // Operaciones CRUD
    handleCreateVehiculo,
    handleUpdateVehiculo,
    handleDeleteVehiculo,
    handleCambiarEstado,

    // Utilidades
    refetch,
  };
};