// =============================================
// useVehicles - Hook para gestión de vehículos (CORREGIDO)
// =============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../global/apis';
import { Vehiculo, VehiculoEstado, TipoVehiculo } from '../../global/types';

// ===================== TIPOS DEL HOOK =====================
interface UseVehiclesConfig {
  estado?: VehiculoEstado | 'all';
  autoFetch?: boolean;
  refreshInterval?: number;
}

interface VehiclesState {
  data: Vehiculo[];
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

interface UseVehiclesActions {
  // CRUD básico
  createVehicle: (data: Omit<Vehiculo, "id_vehiculo">) => Promise<boolean>;
  updateVehicle: (id: string, data: Partial<Vehiculo>) => Promise<boolean>;
  deleteVehicle: (id: string) => Promise<boolean>;
  
  // Operaciones de asignación
  assignToConductor: (vehiculoId: string, conductorId: string) => Promise<boolean>;
  unassignFromConductor: (vehiculoId: string) => Promise<boolean>;
  
  // Utilidades
  getVehicleById: (id: string) => Vehiculo | undefined;
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface UseVehiclesReturn extends VehiclesState, UseVehiclesActions {
  // Datos computados por estado
  vehiculosDisponibles: Vehiculo[];
  vehiculosNoDisponibles: Vehiculo[];
  totalVehiculos: number;
  
  // Estados de las operaciones
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isAssigning: boolean;
  
  // Stats útiles para dashboards
  porcentajeDisponibilidad: number;
  vehiculosPorTipo: Record<TipoVehiculo, number>;
}

// ===================== HOOK PRINCIPAL =====================
export const useVehicles = (config: UseVehiclesConfig = {}): UseVehiclesReturn => {
  const {
    estado = 'all',
    autoFetch = true,
    refreshInterval
  } = config;

  // ===================== ESTADO LOCAL =====================
  const [state, setState] = useState<VehiclesState>({
    data: [],
    loading: false,
    error: null,
    lastFetch: null,
  });

  const [operationStates, setOperationStates] = useState({
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isAssigning: false,
  });

  // ===================== FUNCIONES DE FETCH =====================
  const fetchVehicles = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      let vehiculos: Vehiculo[];
      
      if (estado === 'all') {
        vehiculos = await api.vehiculos.getAll();
      } else {
        vehiculos = await api.vehiculos.getByEstado(estado);
      }
      
      setState(prev => ({
        ...prev,
        data: vehiculos,
        loading: false,
        lastFetch: new Date(),
      }));
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido al obtener vehículos',
      }));
    }
  }, [estado]);

  const refetch = useCallback(async () => {
    await fetchVehicles();
  }, [fetchVehicles]);

  // ===================== EFECTOS =====================
  // Auto-fetch inicial
  useEffect(() => {
    if (autoFetch) {
      fetchVehicles();
    }
  }, [fetchVehicles, autoFetch]);

  // Refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchVehicles, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchVehicles, refreshInterval]);

  // ===================== OPERACIONES CRUD =====================
  const createVehicle = useCallback(async (
    data: Omit<Vehiculo, "id_vehiculo">
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isCreating: true }));
      
      const nuevoVehiculo = await api.vehiculos.create(data);
      
      // Actualizar estado local optimista
      setState(prev => ({
        ...prev,
        data: [nuevoVehiculo, ...prev.data],
        error: null,
      }));
      
      setOperationStates(prev => ({ ...prev, isCreating: false }));
      return true;
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al crear vehículo',
      }));
      setOperationStates(prev => ({ ...prev, isCreating: false }));
      return false;
    }
  }, []);

  const updateVehicle = useCallback(async (
    id: string, 
    data: Partial<Vehiculo>
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isUpdating: true }));
      
      const result = await api.vehiculos.update(id, data);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(vehiculo => 
            vehiculo.id_vehiculo === id ? { ...vehiculo, ...data } : vehiculo
          ),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isUpdating: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al actualizar vehículo',
      }));
      setOperationStates(prev => ({ ...prev, isUpdating: false }));
      return false;
    }
  }, []);

  const deleteVehicle = useCallback(async (id: string): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isDeleting: true }));
      
      const result = await api.vehiculos.delete(id);
      
      if (result.success) {
        // Eliminación optimista
        setState(prev => ({
          ...prev,
          data: prev.data.filter(vehiculo => vehiculo.id_vehiculo !== id),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isDeleting: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al eliminar vehículo',
      }));
      setOperationStates(prev => ({ ...prev, isDeleting: false }));
      return false;
    }
  }, []);

  // ===================== OPERACIONES DE ASIGNACIÓN =====================
  const assignToConductor = useCallback(async (
    vehiculoId: string, 
    conductorId: string
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isAssigning: true }));
      
      const result = await api.vehiculos.assignToConductor(vehiculoId, conductorId);
      
      if (result.success) {
        // Actualización optimista - el vehículo pasa a "No disponible"
        setState(prev => ({
          ...prev,
          data: prev.data.map(vehiculo => 
            vehiculo.id_vehiculo === vehiculoId 
              ? { ...vehiculo, estado: VehiculoEstado.NoDisponible }
              : vehiculo
          ),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isAssigning: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al asignar vehículo a conductor:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al asignar vehículo a conductor',
      }));
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return false;
    }
  }, []);

  const unassignFromConductor = useCallback(async (vehiculoId: string): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isAssigning: true }));
      
      const result = await api.vehiculos.unassignFromConductor(vehiculoId);
      
      if (result.success) {
        // Actualización optimista - el vehículo vuelve a "Disponible"
        setState(prev => ({
          ...prev,
          data: prev.data.map(vehiculo => 
            vehiculo.id_vehiculo === vehiculoId 
              ? { ...vehiculo, estado: VehiculoEstado.Disponible }
              : vehiculo
          ),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isAssigning: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al desasignar vehículo:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al desasignar vehículo',
      }));
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return false;
    }
  }, []);

  // ===================== UTILIDADES =====================
  const getVehicleById = useCallback((id: string): Vehiculo | undefined => {
    return state.data.find(vehiculo => vehiculo.id_vehiculo === id);
  }, [state.data]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ===================== DATOS COMPUTADOS =====================
  const computedData = useMemo(() => {
    const vehiculosDisponibles = state.data.filter(v => v.estado === VehiculoEstado.Disponible);
    const vehiculosNoDisponibles = state.data.filter(v => v.estado === VehiculoEstado.NoDisponible);
    
    const totalVehiculos = state.data.length;
    const porcentajeDisponibilidad = totalVehiculos > 0 
      ? Math.round((vehiculosDisponibles.length / totalVehiculos) * 100)
      : 0;

    // Agrupar vehículos por tipo para estadísticas - CORREGIDO
    const vehiculosPorTipo = state.data.reduce((acc, vehiculo) => {
      const tipo = vehiculo.tipo_vehiculo; // Usando el campo correcto
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<TipoVehiculo, number>);

    return {
      vehiculosDisponibles,
      vehiculosNoDisponibles,
      totalVehiculos,
      porcentajeDisponibilidad,
      vehiculosPorTipo,
    };
  }, [state.data]);

  // ===================== RETURN =====================
  return {
    // Estado básico
    ...state,
    
    // Estados de operaciones
    ...operationStates,
    
    // Datos computados
    ...computedData,
    
    // Operaciones CRUD
    createVehicle,
    updateVehicle,
    deleteVehicle,
    
    // Operaciones de asignación
    assignToConductor,
    unassignFromConductor,
    
    // Utilidades
    getVehicleById,
    refetch,
    clearError,
  };
};

// ===================== HOOKS ESPECÍFICOS =====================

/**
 * Hook específico para obtener solo vehículos disponibles
 * Útil en modales de asignación a conductores
 */
export const useVehiclesDisponibles = () => {
  return useVehicles({ estado: VehiculoEstado.Disponible });
};

/**
 * Hook específico solo para operaciones de asignación
 * Más ligero para componentes que solo asignan/desasignan
 */
export const useVehicleAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignToConductor = useCallback(async (vehiculoId: string, conductorId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.vehiculos.assignToConductor(vehiculoId, conductorId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al asignar vehículo';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const unassignFromConductor = useCallback(async (vehiculoId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.vehiculos.unassignFromConductor(vehiculoId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al desasignar vehículo';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  return {
    assignToConductor,
    unassignFromConductor,
    loading,
    error,
    clearError: () => setError(null),
  };
};

/**
 * Hook para obtener estadísticas de la flota
 * Útil para dashboards y reportes de vehículos
 */
export const useVehicleStats = () => {
  const { 
    vehiculosDisponibles, 
    vehiculosNoDisponibles, 
    totalVehiculos,
    porcentajeDisponibilidad,
    vehiculosPorTipo,
    loading,
    error 
  } = useVehicles();

  const stats = useMemo(() => ({
    total: totalVehiculos,
    disponibles: vehiculosDisponibles.length,
    noDisponibles: vehiculosNoDisponibles.length,
    porcentajeDisponibilidad,
    vehiculosPorTipo,
    // Stats adicionales
    porcentajeAsignados: totalVehiculos > 0 
      ? Math.round((vehiculosNoDisponibles.length / totalVehiculos) * 100) 
      : 0,
  }), [
    totalVehiculos,
    vehiculosDisponibles.length,
    vehiculosNoDisponibles.length,
    porcentajeDisponibilidad,
    vehiculosPorTipo
  ]);

  return {
    stats,
    loading,
    error,
  };
};

// ===================== EXPORT DEFAULT =====================
export default useVehicles;