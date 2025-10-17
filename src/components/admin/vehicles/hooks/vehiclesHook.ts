// src/components/admin/vehicles/hooks/vehiclesHook.ts
import { useState, useCallback, useMemo } from 'react';
import { 
    Vehiculo, 
    CreateVehiculoDto, 
    UpdateVehiculoDto, 
    EstadoVehiculo 
} from '../../../../global/types/vehiclesType';
import { useVehicles } from '../../../../hooks/admin/useVehicles';

// 🚨 DEFINICIÓN DE INTERFACES DE RETORNO (NECESARIA para resolver el error UseVehiclesManagementReturn)
interface ModalState<T> {
    isOpen: boolean;
    vehiculo: T | null;
    isLoading?: boolean;
}

interface AlertState {
    show: boolean;
    msg?: string;
    type?: 'info' | 'success' | 'error' | 'warning';
}

export interface UseVehiclesManagementReturn {
    // Datos y Listas
    vehiculos: Vehiculo[];
    vehiculosDisponibles: Vehiculo[];
    vehiculosNoDisponibles: Vehiculo[];
    loading: boolean;
    error: string | null;

    // Estados de Modales y Alertas
    modalAgregarState: { isOpen: boolean; isLoading: boolean; };
    modalDetallesState: ModalState<Vehiculo>;
    modalEditarState: ModalState<Vehiculo>;
    alertState: AlertState;

    // Funciones de Modales
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
    // 🟢 SINTAXIS CORREGIDA: Asegurando que el '{' envuelva la lista de propiedades
    const { 
        data: vehiculos, // ⬅️ Renombramos 'data' a 'vehiculos'
        loading,
        error,
        createVehiculo,
        updateVehiculo,
        deleteVehiculo,
        cambiarEstado,
        refetch,
        clearError,
        // Importamos directamente las listas calculadas por useVehicles (eliminado el duplicado)
        vehiculosDisponibles,
        vehiculosNoDisponibles,
    } = useVehicles({ autoFetch: true }); // ⬅️ La llamada de la función cierra el 'const'

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

    const abrirModalAgregar = useCallback(() => {
        setModalAgregarState({ isOpen: true, isLoading: false });
    }, []);

    const cerrarModalAgregar = useCallback(() => {
        setModalAgregarState({ isOpen: false, isLoading: false });
    }, []);

    const abrirModalDetalles = useCallback((vehiculo: Vehiculo) => {
        setModalDetallesState({
            isOpen: true,
            vehiculo: vehiculo,
        });
    }, []);

    const cerrarModalDetalles = useCallback(() => {
        setModalDetallesState({
            isOpen: false,
            vehiculo: null,
        });
    }, []);

    const abrirModalEditar = useCallback((vehiculo: Vehiculo) => {
        setModalEditarState({
            isOpen: true,
            vehiculo: vehiculo,
            isLoading: false,
        });
    }, []);

    const cerrarModalEditar = useCallback(() => {
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
            setModalAgregarState((prev) => ({ ...prev, isLoading: true }));
            try {
                const success = await createVehiculo(data);
                if (success) {
                    showAlert('Vehículo creado exitosamente', 'success');
                    return true;
                } else {
                    showAlert('Error al crear vehículo', 'error');
                    return false;
                }
            } catch (err) {
                showAlert('Error inesperado al crear vehículo', 'error');
                return false;
            } finally {
                setModalAgregarState((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [createVehiculo, showAlert]
    );

    /**
     * Actualizar un vehículo existente
     */
    const handleUpdateVehiculo = useCallback(
        async (id: string, data: UpdateVehiculoDto): Promise<boolean> => {
            setModalEditarState((prev) => ({ ...prev, isLoading: true }));
            try {
                const success = await updateVehiculo(id, data);
                if (success) {
                    showAlert('Vehículo actualizado exitosamente', 'success');
                    return true;
                } else {
                    showAlert('Error al actualizar vehículo', 'error');
                    return false;
                }
            } catch (err) {
                showAlert('Error inesperado al actualizar vehículo', 'error');
                return false;
            } finally {
                setModalEditarState((prev) => ({ ...prev, isLoading: false }));
            }
        },
        [updateVehiculo, showAlert]
    );

    /**
     * Eliminar un vehículo
     */
    const handleDeleteVehiculo = useCallback(
        async (id: string): Promise<void> => {
            const confirmar = window.confirm(
                '¿Estás seguro de que deseas eliminar este vehículo?\n\nEsta acción no se puede deshacer.'
            );

            if (!confirmar) {
                return;
            }

            try {
                const success = await deleteVehiculo(id);
                if (success) {
                    showAlert('Vehículo eliminado exitosamente', 'success');
                } else {
                    showAlert('Error al eliminar vehículo', 'error');
                }
            } catch (err) {
                showAlert('Error inesperado al eliminar vehículo', 'error');
            }
        },
        [deleteVehiculo, showAlert]
    );

    /**
     * Cambiar estado de disponibilidad
     */
    const handleCambiarEstado = useCallback(
        async (id: string, disponible: boolean): Promise<void> => {
            const estadoTexto = disponible ? 'disponible' : 'no disponible';
            const confirmar = window.confirm(
                `¿Deseas marcar este vehículo como ${estadoTexto}?`
            );

            if (!confirmar) {
                return;
            }

            try {
                const success = await cambiarEstado(id, disponible);
                if (success) {
                    showAlert(
                        `Vehículo marcado como ${estadoTexto} exitosamente`,
                        'success'
                    );
                } else {
                    showAlert('Error al cambiar estado del vehículo', 'error');
                }
            } catch (err) {
                showAlert('Error inesperado al cambiar estado', 'error');
            }
        },
        [cambiarEstado, showAlert]
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