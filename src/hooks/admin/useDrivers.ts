// =============================================
// useDrivers - Hook para gestión de conductores
// =============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../global/apis';
import { Conductor, ConductorEstado, Vehiculo } from '../../global/dataMock';

// ===================== TIPOS DEL HOOK =====================
interface UseDriversConfig {
  estado?: ConductorEstado | 'all';
  autoFetch?: boolean;
  refreshInterval?: number;
  includeVehicleInfo?: boolean; // Para obtener info del vehículo asignado
}

interface DriversState {
  data: Conductor[];
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

interface UseDriversActions {
  // Operaciones de estado
  updateEstado: (conductorId: string, nuevoEstado: ConductorEstado) => Promise<boolean>;
  
  // Operaciones de asignación de rutas
  assignRuta: (conductorId: string, rutaId: string) => Promise<boolean>;
  
  // Obtener conductor con información extendida
  getConductorWithDetails: (conductorId: string) => Promise<(Conductor & { vehiculo?: Vehiculo }) | null>;
  
  // Utilidades
  getConductorById: (id: string) => Conductor | undefined;
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface UseDriversReturn extends DriversState, UseDriversActions {
  // Datos computados por estado
  conductoresDisponibles: Conductor[];
  conductoresEnRuta: Conductor[];
  conductoresNoDisponibles: Conductor[];
  totalConductores: number;
  
  // Estados de las operaciones
  isUpdatingStatus: boolean;
  isAssigning: boolean;
  
  // Stats útiles para dashboards
  porcentajeDisponibilidad: number;
}

// ===================== HOOK PRINCIPAL =====================
export const useDrivers = (config: UseDriversConfig = {}): UseDriversReturn => {
  const {
    estado = 'all',
    autoFetch = true,
    refreshInterval,
    includeVehicleInfo = false
  } = config;

  // ===================== ESTADO LOCAL =====================
  const [state, setState] = useState<DriversState>({
    data: [],
    loading: false,
    error: null,
    lastFetch: null,
  });

  const [operationStates, setOperationStates] = useState({
    isUpdatingStatus: false,
    isAssigning: false,
  });

  // ===================== FUNCIONES DE FETCH =====================
  const fetchDrivers = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      let conductores: Conductor[];
      
      if (estado === 'all') {
        conductores = await api.conductores.getAll();
      } else {
        conductores = await api.conductores.getByEstado(estado);
      }
      
      setState(prev => ({
        ...prev,
        data: conductores,
        loading: false,
        lastFetch: new Date(),
      }));
    } catch (error) {
      console.error('Error al obtener conductores:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido al obtener conductores',
      }));
    }
  }, [estado]);

  const refetch = useCallback(async () => {
    await fetchDrivers();
  }, [fetchDrivers]);

  // ===================== EFECTOS =====================
  // Auto-fetch inicial
  useEffect(() => {
    if (autoFetch) {
      fetchDrivers();
    }
  }, [fetchDrivers, autoFetch]);

  // Refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchDrivers, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchDrivers, refreshInterval]);

  // ===================== OPERACIONES DE ESTADO =====================
  const updateEstado = useCallback(async (
    conductorId: string, 
    nuevoEstado: ConductorEstado
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isUpdatingStatus: true }));
      
      const result = await api.conductores.updateEstado(conductorId, nuevoEstado);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(conductor => 
            conductor.id_conductor === conductorId 
              ? { ...conductor, estado: nuevoEstado }
              : conductor
          ),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isUpdatingStatus: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al actualizar estado del conductor:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al actualizar estado del conductor',
      }));
      setOperationStates(prev => ({ ...prev, isUpdatingStatus: false }));
      return false;
    }
  }, []);

  // ===================== OPERACIONES DE ASIGNACIÓN =====================
  const assignRuta = useCallback(async (
    conductorId: string, 
    rutaId: string
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isAssigning: true }));
      
      const result = await api.conductores.assignRuta(conductorId, rutaId);
      
      if (result.success) {
        // Actualización optimista - el conductor pasa a "En ruta"
        setState(prev => ({
          ...prev,
          data: prev.data.map(conductor => 
            conductor.id_conductor === conductorId 
              ? { ...conductor, estado: ConductorEstado.EnRuta }
              : conductor
          ),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isAssigning: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al asignar ruta al conductor:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al asignar ruta al conductor',
      }));
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return false;
    }
  }, []);

  // ===================== INFORMACIÓN EXTENDIDA =====================
  const getConductorWithDetails = useCallback(async (
    conductorId: string
  ): Promise<(Conductor & { vehiculo?: Vehiculo }) | null> => {
    try {
      const conductorConDetalles = await api.conductores.getById(conductorId);
      return conductorConDetalles;
    } catch (error) {
      console.error('Error al obtener detalles del conductor:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al obtener detalles del conductor',
      }));
      return null;
    }
  }, []);

  // ===================== UTILIDADES =====================
  const getConductorById = useCallback((id: string): Conductor | undefined => {
    return state.data.find(conductor => conductor.id_conductor === id);
  }, [state.data]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ===================== DATOS COMPUTADOS =====================
  const computedData = useMemo(() => {
    const conductoresDisponibles = state.data.filter(c => c.estado === ConductorEstado.Disponible);
    const conductoresEnRuta = state.data.filter(c => c.estado === ConductorEstado.EnRuta);
    const conductoresNoDisponibles = state.data.filter(c => c.estado === ConductorEstado.NoDisponible);
    
    const totalConductores = state.data.length;
    const porcentajeDisponibilidad = totalConductores > 0 
      ? Math.round((conductoresDisponibles.length / totalConductores) * 100)
      : 0;

    return {
      conductoresDisponibles,
      conductoresEnRuta,
      conductoresNoDisponibles,
      totalConductores,
      porcentajeDisponibilidad,
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
    
    // Operaciones de estado
    updateEstado,
    
    // Operaciones de asignación
    assignRuta,
    
    // Información extendida
    getConductorWithDetails,
    
    // Utilidades
    getConductorById,
    refetch,
    clearError,
  };
};

// ===================== HOOKS ESPECÍFICOS =====================

/**
 * Hook específico para obtener solo conductores disponibles
 * Útil en modales de asignación de rutas
 */
export const useDriversDisponibles = () => {
  return useDrivers({ estado: ConductorEstado.Disponible });
};

/**
 * Hook específico para monitoreo de conductores en ruta
 * Útil para dashboards de seguimiento
 */
export const useDriversEnRuta = () => {
  return useDrivers({ 
    estado: ConductorEstado.EnRuta,
    refreshInterval: 30000, // Refresh cada 30 segundos para monitoreo
  });
};

/**
 * Hook específico solo para operaciones de asignación
 * Más ligero para componentes que solo asignan rutas
 */
export const useDriverAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignRuta = useCallback(async (conductorId: string, rutaId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.conductores.assignRuta(conductorId, rutaId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al asignar ruta';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const updateEstado = useCallback(async (conductorId: string, nuevoEstado: ConductorEstado) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.conductores.updateEstado(conductorId, nuevoEstado);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar estado';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  return {
    assignRuta,
    updateEstado,
    loading,
    error,
    clearError: () => setError(null),
  };
};

/**
 * Hook para obtener estadísticas de conductores
 * Útil para dashboards y reportes
 */
export const useDriverStats = () => {
  const { 
    conductoresDisponibles, 
    conductoresEnRuta, 
    conductoresNoDisponibles,
    totalConductores,
    porcentajeDisponibilidad,
    loading,
    error 
  } = useDrivers();

  const stats = useMemo(() => ({
    total: totalConductores,
    disponibles: conductoresDisponibles.length,
    enRuta: conductoresEnRuta.length,
    noDisponibles: conductoresNoDisponibles.length,
    porcentajeDisponibilidad,
    // Stats adicionales
    porcentajeEnRuta: totalConductores > 0 
      ? Math.round((conductoresEnRuta.length / totalConductores) * 100) 
      : 0,
  }), [
    totalConductores,
    conductoresDisponibles.length,
    conductoresEnRuta.length,
    conductoresNoDisponibles.length,
    porcentajeDisponibilidad
  ]);

  return {
    stats,
    loading,
    error,
  };
};

// ===================== EXPORT DEFAULT =====================
export default useDrivers;