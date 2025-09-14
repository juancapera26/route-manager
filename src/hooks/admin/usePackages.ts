// =============================================
// usePaquetes - Hook para gestión de paquetes
// =============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../global/apis';
import { Paquete, PaquetesEstados } from '../../global/dataMock';

// ===================== TIPOS DEL HOOK =====================
interface UsePaquetesConfig {
  estado?: PaquetesEstados | 'all';
  autoFetch?: boolean;
  refreshInterval?: number;
  searchQuery?: string;
  dateRange?: {
    fromDate?: string;
    toDate?: string;
  };
}

interface PaquetesState {
  data: Paquete[];
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

interface UsePaquetesActions {
  // CRUD básico
  createPaquete: (data: Omit<Paquete, "id_paquete" | "fecha_registro" | "estado" | "fecha_entrega" | "id_rutas_asignadas" | "id_conductor_asignado">) => Promise<boolean>;
  updatePaquete: (id: string, data: Partial<Paquete>) => Promise<boolean>;
  deletePaquete: (id: string) => Promise<boolean>;
  
  // Operaciones de flujo principal
  assignPaquete: (paqueteId: string, rutaId: string, conductorId?: string) => Promise<boolean>;
  cancelAssignment: (paqueteId: string, rutaId: string) => Promise<boolean>;
  reassignPaquete: (paqueteId: string, nuevaRutaId: string, nuevoConductorId?: string, observacion?: string) => Promise<boolean>;
  
  // Cambios de estado del flujo
  markEnRuta: (paqueteId: string) => Promise<boolean>;
  markEntregado: (paqueteId: string, observacion?: string, imagen?: string) => Promise<boolean>;
  markFallido: (paqueteId: string, observacion?: string) => Promise<boolean>;
  
  // Utilidades
  getPaqueteById: (id: string) => Paquete | undefined;
  refetch: () => Promise<void>;
  clearError: () => void;
  
  // Filtros y búsqueda
  updateFilters: (filters: Partial<UsePaquetesConfig>) => void;
}

interface UsePaquetesReturn extends PaquetesState, UsePaquetesActions {
  // Datos computados por estado
  paquetesPendientes: Paquete[];
  paquetesAsignados: Paquete[];
  paquetesEnRuta: Paquete[];
  paquetesEntregados: Paquete[];
  paquetesFallidos: Paquete[];
  totalPaquetes: number;
  
  // Estados de las operaciones
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isAssigning: boolean;
  
  // Filtros activos
  activeFilters: UsePaquetesConfig;
}

// ===================== HOOK PRINCIPAL =====================
export const usePaquetes = (config: UsePaquetesConfig = {}): UsePaquetesReturn => {
  const {
    estado = 'all',
    autoFetch = true,
    refreshInterval,
    searchQuery,
    dateRange
  } = config;

  // ===================== ESTADO LOCAL =====================
  const [state, setState] = useState<PaquetesState>({
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

  const [filters, setFilters] = useState<UsePaquetesConfig>(config);

  // ===================== FUNCIONES DE FETCH =====================
  const fetchPaquetes = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentEstado = filters.estado || estado;
      const currentSearch = filters.searchQuery || searchQuery;
      const currentDateRange = filters.dateRange || dateRange;
      
      let paquetes: Paquete[];
      
      if (currentEstado === 'all') {
        paquetes = await api.paquetes.getAll(
          currentSearch,
          null,
          currentDateRange?.fromDate,
          currentDateRange?.toDate
        );
      } else {
        // Para filtros específicos, primero obtenemos todos y luego filtramos
        paquetes = await api.paquetes.getAll(
          currentSearch,
          currentEstado,
          currentDateRange?.fromDate,
          currentDateRange?.toDate
        );
      }
      
      setState(prev => ({
        ...prev,
        data: paquetes,
        loading: false,
        lastFetch: new Date(),
      }));
    } catch (error) {
      console.error('Error al obtener paquetes:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido al obtener paquetes',
      }));
    }
  }, [estado, searchQuery, dateRange, filters]);

  const refetch = useCallback(async () => {
    await fetchPaquetes();
  }, [fetchPaquetes]);

  // ===================== EFECTOS =====================
  // Auto-fetch inicial
  useEffect(() => {
    if (autoFetch) {
      fetchPaquetes();
    }
  }, [fetchPaquetes, autoFetch]);

  // Refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchPaquetes, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchPaquetes, refreshInterval]);

  // Re-fetch cuando cambian los filtros
  useEffect(() => {
    if (autoFetch) {
      fetchPaquetes();
    }
  }, [filters, fetchPaquetes, autoFetch]);

  // ===================== OPERACIONES CRUD =====================
  const createPaquete = useCallback(async (
    data: Omit<Paquete, "id_paquete" | "fecha_registro" | "estado" | "fecha_entrega" | "id_rutas_asignadas" | "id_conductor_asignado">
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isCreating: true }));
      
      const nuevoPaquete = await api.paquetes.create(data);
      
      // Actualizar estado local optimista
      setState(prev => ({
        ...prev,
        data: [nuevoPaquete, ...prev.data],
        error: null,
      }));
      
      setOperationStates(prev => ({ ...prev, isCreating: false }));
      return true;
    } catch (error) {
      console.error('Error al crear paquete:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al crear paquete',
      }));
      setOperationStates(prev => ({ ...prev, isCreating: false }));
      return false;
    }
  }, []);

  const updatePaquete = useCallback(async (
    id: string, 
    data: Partial<Paquete>
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isUpdating: true }));
      
      const result = await api.paquetes.update(id, data);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(paquete => 
            paquete.id_paquete === id ? { ...paquete, ...data } : paquete
          ),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isUpdating: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al actualizar paquete:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al actualizar paquete',
      }));
      setOperationStates(prev => ({ ...prev, isUpdating: false }));
      return false;
    }
  }, []);

  const deletePaquete = useCallback(async (id: string): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isDeleting: true }));
      
      const result = await api.paquetes.delete(id);
      
      if (result.success) {
        // Eliminación optimista
        setState(prev => ({
          ...prev,
          data: prev.data.filter(paquete => paquete.id_paquete !== id),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isDeleting: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al eliminar paquete:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al eliminar paquete',
      }));
      setOperationStates(prev => ({ ...prev, isDeleting: false }));
      return false;
    }
  }, []);

  // ===================== OPERACIONES DE FLUJO PRINCIPAL =====================
  const assignPaquete = useCallback(async (
    paqueteId: string, 
    rutaId: string,
    conductorId?: string
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isAssigning: true }));
      
      const result = await api.paquetes.assign(paqueteId, rutaId, conductorId);
      
      if (result.success) {
        // Actualización optimista del estado del paquete
        setState(prev => ({
          ...prev,
          data: prev.data.map(paquete => 
            paquete.id_paquete === paqueteId 
              ? { 
                  ...paquete, 
                  estado: PaquetesEstados.Asignado,
                  id_rutas_asignadas: [...paquete.id_rutas_asignadas, rutaId],
                  id_conductor_asignado: conductorId || paquete.id_conductor_asignado
                }
              : paquete
          ),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isAssigning: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al asignar paquete:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al asignar paquete',
      }));
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return false;
    }
  }, []);

  const cancelAssignment = useCallback(async (
    paqueteId: string, 
    rutaId: string
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isAssigning: true }));
      
      const result = await api.paquetes.cancelAssignment(paqueteId, rutaId);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(paquete => {
            if (paquete.id_paquete === paqueteId) {
              const nuevasRutas = paquete.id_rutas_asignadas.filter(r => r !== rutaId);
              return {
                ...paquete,
                id_rutas_asignadas: nuevasRutas,
                estado: nuevasRutas.length === 0 ? PaquetesEstados.Pendiente : paquete.estado,
                id_conductor_asignado: nuevasRutas.length === 0 ? null : paquete.id_conductor_asignado,
              };
            }
            return paquete;
          }),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isAssigning: false }));
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
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return false;
    }
  }, []);

  const reassignPaquete = useCallback(async (
    paqueteId: string, 
    nuevaRutaId: string,
    nuevoConductorId?: string,
    observacion?: string
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isAssigning: true }));
      
      const result = await api.paquetes.reassign(paqueteId, nuevaRutaId, nuevoConductorId, observacion);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(paquete => 
            paquete.id_paquete === paqueteId 
              ? { 
                  ...paquete, 
                  estado: PaquetesEstados.Asignado,
                  id_rutas_asignadas: [...paquete.id_rutas_asignadas, nuevaRutaId],
                  id_conductor_asignado: nuevoConductorId || paquete.id_conductor_asignado,
                  observacion_conductor: observacion || paquete.observacion_conductor
                }
              : paquete
          ),
          error: null,
        }));
        setOperationStates(prev => ({ ...prev, isAssigning: false }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al reasignar paquete:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al reasignar paquete',
      }));
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return false;
    }
  }, []);

  // ===================== CAMBIOS DE ESTADO DEL FLUJO =====================
  const markEnRuta = useCallback(async (paqueteId: string): Promise<boolean> => {
    try {
      const result = await api.paquetes.markEnRuta(paqueteId);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(paquete => 
            paquete.id_paquete === paqueteId 
              ? { ...paquete, estado: PaquetesEstados.EnRuta }
              : paquete
          ),
          error: null,
        }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al marcar paquete en ruta:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al marcar paquete en ruta',
      }));
      return false;
    }
  }, []);

  const markEntregado = useCallback(async (
    paqueteId: string, 
    observacion?: string,
    imagen?: string
  ): Promise<boolean> => {
    try {
      const result = await api.paquetes.markEntregado(paqueteId, observacion, imagen);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(paquete => 
            paquete.id_paquete === paqueteId 
              ? { 
                  ...paquete, 
                  estado: PaquetesEstados.Entregado,
                  fecha_entrega: new Date().toISOString(),
                  observacion_conductor: observacion || paquete.observacion_conductor,
                  imagen_adjunta: imagen || paquete.imagen_adjunta
                }
              : paquete
          ),
          error: null,
        }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al marcar paquete como entregado:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al marcar paquete como entregado',
      }));
      return false;
    }
  }, []);

  const markFallido = useCallback(async (
    paqueteId: string, 
    observacion?: string
  ): Promise<boolean> => {
    try {
      const result = await api.paquetes.markFallido(paqueteId, observacion);
      
      if (result.success) {
        // Actualización optimista
        setState(prev => ({
          ...prev,
          data: prev.data.map(paquete => 
            paquete.id_paquete === paqueteId 
              ? { 
                  ...paquete, 
                  estado: PaquetesEstados.Fallido,
                  observacion_conductor: observacion || paquete.observacion_conductor
                }
              : paquete
          ),
          error: null,
        }));
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al marcar paquete como fallido:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al marcar paquete como fallido',
      }));
      return false;
    }
  }, []);

  // ===================== UTILIDADES =====================
  const getPaqueteById = useCallback((id: string): Paquete | undefined => {
    return state.data.find(paquete => paquete.id_paquete === id);
  }, [state.data]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<UsePaquetesConfig>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // ===================== DATOS COMPUTADOS =====================
  const computedData = useMemo(() => {
    const paquetesPendientes = state.data.filter(p => p.estado === PaquetesEstados.Pendiente);
    const paquetesAsignados = state.data.filter(p => p.estado === PaquetesEstados.Asignado);
    const paquetesEnRuta = state.data.filter(p => p.estado === PaquetesEstados.EnRuta);
    const paquetesEntregados = state.data.filter(p => p.estado === PaquetesEstados.Entregado);
    const paquetesFallidos = state.data.filter(p => p.estado === PaquetesEstados.Fallido);

    return {
      paquetesPendientes,
      paquetesAsignados,
      paquetesEnRuta,
      paquetesEntregados,
      paquetesFallidos,
      totalPaquetes: state.data.length,
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
    createPaquete,
    updatePaquete,
    deletePaquete,
    
    // Operaciones de flujo principal
    assignPaquete,
    cancelAssignment,
    reassignPaquete,
    
    // Cambios de estado del flujo
    markEnRuta,
    markEntregado,
    markFallido,
    
    // Utilidades
    getPaqueteById,
    refetch,
    clearError,
    updateFilters,
    
    // Filtros activos
    activeFilters: filters,
  };
};

// ===================== HOOKS ESPECÍFICOS (OPCIONALES) =====================

/**
 * Hook específico para obtener solo paquetes pendientes
 * Útil en modales de asignación
 */
export const usePaquetesPendientes = () => {
  return usePaquetes({ estado: PaquetesEstados.Pendiente });
};

/**
 * Hook específico para paquetes fallidos que pueden ser reasignados
 */
export const usePaquetesFallidos = () => {
  return usePaquetes({ estado: PaquetesEstados.Fallido });
};

/**
 * Hook específico para operaciones de asignación y reasignación
 * Separado para componentes que solo necesitan estas operaciones
 */
export const usePaqueteAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignPaquete = useCallback(async (
    paqueteId: string, 
    rutaId: string, 
    conductorId?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.paquetes.assign(paqueteId, rutaId, conductorId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al asignar paquete';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const reassignPaquete = useCallback(async (
    paqueteId: string, 
    nuevaRutaId: string, 
    nuevoConductorId?: string,
    observacion?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.paquetes.reassign(paqueteId, nuevaRutaId, nuevoConductorId, observacion);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al reasignar paquete';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const cancelAssignment = useCallback(async (paqueteId: string, rutaId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.paquetes.cancelAssignment(paqueteId, rutaId);
      
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
    assignPaquete,
    reassignPaquete,
    cancelAssignment,
    loading,
    error,
    clearError: () => setError(null),
  };
};

/**
 * Hook específico para cambios de estado en el flujo de entrega
 * Útil para conductores que necesitan actualizar estados
 */
export const usePaqueteStatusUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markEnRuta = useCallback(async (paqueteId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.paquetes.markEnRuta(paqueteId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar en ruta';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const markEntregado = useCallback(async (
    paqueteId: string, 
    observacion?: string,
    imagen?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.paquetes.markEntregado(paqueteId, observacion, imagen);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar como entregado';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  const markFallido = useCallback(async (paqueteId: string, observacion?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.paquetes.markFallido(paqueteId, observacion);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al marcar como fallido';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  return {
    markEnRuta,
    markEntregado,
    markFallido,
    loading,
    error,
    clearError: () => setError(null),
  };
};

// ===================== EXPORT DEFAULT =====================
export default usePaquetes;