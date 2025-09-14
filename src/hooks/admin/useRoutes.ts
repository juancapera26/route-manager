// =============================================
// useRutas - Hook para gestión de rutas
// =============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../global/apis';
import { Ruta, RutaEstado } from '../../global/dataMock';

// ===================== TIPOS DEL HOOK =====================
interface UseRutasConfig {
  estado?: RutaEstado | 'all';
  autoFetch?: boolean;
  refreshInterval?: number;
}

interface RutasState {
  data: Ruta[];
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

interface UseRutasActions {
  // CRUD básico
  createRuta: (data: Omit<Ruta, "id_ruta" | "fecha_registro" | "estado" | "paquetes_asignados" | "id_conductor_asignado">) => Promise<boolean>;
  updateRuta: (id: string, data: Partial<Ruta>) => Promise<boolean>;
  deleteRuta: (id: string) => Promise<boolean>;
  
  // Operaciones de flujo
  assignConductor: (rutaId: string, conductorId: string) => Promise<boolean>;
  cancelAssignment: (rutaId: string) => Promise<boolean>;
  completeRuta: (rutaId: string) => Promise<boolean>;
  markAsFailida: (rutaId: string) => Promise<boolean>;
  
  // Utilidades
  getRutaById: (id: string) => Ruta | undefined;
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface UseRutasReturn extends RutasState, UseRutasActions {
  // Datos computados
  rutasPendientes: Ruta[];
  rutasAsignadas: Ruta[];
  rutasCompletadas: Ruta[];
  rutasFallidas: Ruta[];
  totalRutas: number;
  
  // Estado de las operaciones
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

// ===================== HOOK PRINCIPAL =====================
export const useRutas = (config: UseRutasConfig = {}): UseRutasReturn => {
  const {
    estado = 'all',
    autoFetch = true,
    refreshInterval
  } = config;

  // ===================== ESTADO LOCAL =====================
  const [state, setState] = useState<RutasState>({
    data: [],
    loading: false,
    error: null,
    lastFetch: null,
  });

  const [operationStates, setOperationStates] = useState({
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  });

  // ===================== FUNCIONES DE FETCH =====================
  const fetchRutas = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      let rutas: Ruta[];
      
      if (estado === 'all') {
        rutas = await api.rutas.getAll();
      } else {
        rutas = await api.rutas.getByEstado(estado);
      }
      
      setState(prev => ({
        ...prev,
        data: rutas,
        loading: false,
        lastFetch: new Date(),
      }));
    } catch (error) {
      console.error('Error al obtener rutas:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido al obtener rutas',
      }));
    }
  }, [estado]);

  const refetch = useCallback(async () => {
    await fetchRutas();
  }, [fetchRutas]);

  // ===================== EFECTOS =====================
  // Auto-fetch inicial
  useEffect(() => {
    if (autoFetch) {
      fetchRutas();
    }
  }, [fetchRutas, autoFetch]);

  // Refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchRutas, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchRutas, refreshInterval]);

  // ===================== OPERACIONES CRUD =====================
  const createRuta = useCallback(async (
    data: Omit<Ruta, "id_ruta" | "fecha_registro" | "estado" | "paquetes_asignados" | "id_conductor_asignado">
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isCreating: true }));
      
      const nuevaRuta = await api.rutas.create(data);
      
      // Actualizar estado local optimista
      setState(prev => ({
        ...prev,
        data: [nuevaRuta, ...prev.data],
        error: null,
      }));
      
      setOperationStates(prev => ({ ...prev, isCreating: false }));
      return true;
    } catch (error) {
      console.error('Error al crear ruta:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al crear ruta',
      }));
      setOperationStates(prev => ({ ...prev, isCreating: false }));
      return false;
    }
  }, []);

  const updateRuta = useCallback(async (
    id: string, 
    data: Partial<Ruta>
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isUpdating: true }));
      
      const result = await api.rutas.update(id, data);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(ruta => 
            ruta.id_ruta === id ? { ...ruta, ...data } : ruta
          ),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isUpdating: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al actualizar ruta:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al actualizar ruta',
      }));
      setOperationStates(prev => ({ ...prev, isUpdating: false }));
      return false;
    }
  }, []);

  const deleteRuta = useCallback(async (id: string): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isDeleting: true }));
      
      const result = await api.rutas.delete(id);
      
      if (result.success) {
        // Eliminación optimista
        setState(prev => ({
          ...prev,
          data: prev.data.filter(ruta => ruta.id_ruta !== id),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isDeleting: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al eliminar ruta:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al eliminar ruta',
      }));
      setOperationStates(prev => ({ ...prev, isDeleting: false }));
      return false;
    }
  }, []);

  // ===================== OPERACIONES DE FLUJO =====================
  const assignConductor = useCallback(async (
    rutaId: string, 
    conductorId: string
  ): Promise<boolean> => {
    try {
      const result = await api.rutas.assignConductor(rutaId, conductorId);
      
      if (result.success) {
        // Actualización optimista del estado de la ruta
        setState(prev => ({
          ...prev,
          data: prev.data.map(ruta => 
            ruta.id_ruta === rutaId 
              ? { 
                  ...ruta, 
                  id_conductor_asignado: conductorId,
                  estado: RutaEstado.asignada 
                }
              : ruta
          ),
          error: null,
        }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al asignar conductor:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al asignar conductor',
      }));
      return false;
    }
  }, []);

  const cancelAssignment = useCallback(async (rutaId: string): Promise<boolean> => {
    try {
      const result = await api.rutas.cancelAssignment(rutaId);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(ruta => 
            ruta.id_ruta === rutaId 
              ? { 
                  ...ruta, 
                  id_conductor_asignado: null,
                  estado: RutaEstado.Pendiente 
                }
              : ruta
          ),
          error: null,
        }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al cancelar asignación:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al cancelar asignación',
      }));
      return false;
    }
  }, []);

  const completeRuta = useCallback(async (rutaId: string): Promise<boolean> => {
    try {
      const result = await api.rutas.complete(rutaId);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(ruta => 
            ruta.id_ruta === rutaId 
              ? { ...ruta, estado: RutaEstado.Completada }
              : ruta
          ),
          error: null,
        }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al completar ruta:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al completar ruta',
      }));
      return false;
    }
  }, []);

  const markAsFailida = useCallback(async (rutaId: string): Promise<boolean> => {
    try {
      const result = await api.rutas.markFallida(rutaId);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(ruta => 
            ruta.id_ruta === rutaId 
              ? { ...ruta, estado: RutaEstado.Fallida }
              : ruta
          ),
          error: null,
        }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al marcar ruta como fallida:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al marcar ruta como fallida',
      }));
      return false;
    }
  }, []);

  // ===================== UTILIDADES =====================
  const getRutaById = useCallback((id: string): Ruta | undefined => {
    return state.data.find(ruta => ruta.id_ruta === id);
  }, [state.data]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ===================== DATOS COMPUTADOS =====================
  const computedData = useMemo(() => {
    const rutasPendientes = state.data.filter(ruta => ruta.estado === RutaEstado.Pendiente);
    const rutasAsignadas = state.data.filter(ruta => ruta.estado === RutaEstado.asignada);
    const rutasCompletadas = state.data.filter(ruta => ruta.estado === RutaEstado.Completada);
    const rutasFallidas = state.data.filter(ruta => ruta.estado === RutaEstado.Fallida);

    return {
      rutasPendientes,
      rutasAsignadas,
      rutasCompletadas,
      rutasFallidas,
      totalRutas: state.data.length,
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
    createRuta,
    updateRuta,
    deleteRuta,
    
    // Operaciones de flujo
    assignConductor,
    cancelAssignment,
    completeRuta,
    markAsFailida,
    
    // Utilidades
    getRutaById,
    refetch,
    clearError,
  };
};

// ===================== HOOKS ESPECÍFICOS (OPCIONALES) =====================

/**
 * Hook específico para obtener solo rutas pendientes
 * Útil en modales de asignación
 */
export const useRutasPendientes = () => {
  return useRutas({ estado: RutaEstado.Pendiente });
};

/**
 * Hook específico para operaciones de asignación
 * Separado para componentes que solo necesitan asignar
 */
export const useRutaAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignConductor = useCallback(async (rutaId: string, conductorId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.rutas.assignConductor(rutaId, conductorId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al asignar conductor';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const cancelAssignment = useCallback(async (rutaId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.rutas.cancelAssignment(rutaId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar asignación';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  return {
    assignConductor,
    cancelAssignment,
    loading,
    error,
    clearError: () => setError(null),
  };
};

// ===================== EXPORT DEFAULT =====================
export default useRutas;