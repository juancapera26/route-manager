// =============================================
// usePaquetes - Hook para gestión de paquetes
// =============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../global/apis';
import { Paquete, PaquetesEstados, Ruta, Conductor, Vehiculo } from '../../global/types';

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
  onRelatedEntitiesUpdate?: (related: {
    ruta?: Ruta;
    conductor?: Conductor;
    vehiculo?: Vehiculo;
    paquetes?: Paquete[];
  }) => void;  // Callback opcional para manejar entidades relacionadas (e.g., sincronizar con otros hooks)
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
    dateRange,
    onRelatedEntitiesUpdate,
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
      
      if (currentEstado !== 'all') {
        paquetes = await api.paquetes.getByEstado(currentEstado as PaquetesEstados);
      } else {
        paquetes = await api.paquetes.getAll();
      }
      
      // Filtrado client-side para search y dateRange (API no lo soporta)
      if (currentSearch) {
        const lowerSearch = currentSearch.toLowerCase();
        paquetes = paquetes.filter(p => 
          p.id_paquete.toLowerCase().includes(lowerSearch) ||
          p.destinatario.nombre.toLowerCase().includes(lowerSearch) ||
          p.destinatario.apellido.toLowerCase().includes(lowerSearch)
        );
      }
      
      if (currentDateRange?.fromDate || currentDateRange?.toDate) {
        const from = currentDateRange.fromDate ? new Date(currentDateRange.fromDate) : null;
        const to = currentDateRange.toDate ? new Date(currentDateRange.toDate) : null;
        paquetes = paquetes.filter(p => {
          const regDate = new Date(p.fecha_registro);
          return (!from || regDate >= from) && (!to || regDate <= to);
        });
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
      
      const result = await api.paquetes.create(data);
      const nuevoPaquete = result.entidadPrincipal;
      
      // Actualizar estado local optimista
      setState(prev => ({
        ...prev,
        data: [nuevoPaquete, ...prev.data],
        error: null,
      }));
      
      // Manejar entidadesRelacionadas si existen
      if (result.entidadesRelacionadas && onRelatedEntitiesUpdate) {
        onRelatedEntitiesUpdate(result.entidadesRelacionadas);
      }
      
      setOperationStates(prev => ({ ...prev, isCreating: false }));
      return true;
    } catch (error) {
  const msg = error instanceof Error ? error.message : 'Error al crear paquete';
  console.error('Error al crear paquete:', msg);

  setState(prev => ({ ...prev, error: msg }));
  setOperationStates(prev => ({ ...prev, isCreating: false }));
  return false;
}

  }, [onRelatedEntitiesUpdate]);

  const updatePaquete = useCallback(async (
    id: string, 
    data: Partial<Paquete>
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isUpdating: true }));
      
      const result = await api.paquetes.update(id, data);
      const paqueteActualizado = result.entidadPrincipal;
      
      // Actualización optimista
      setState(prev => ({
        ...prev,
        data: prev.data.map(paquete => 
          paquete.id_paquete === id ? paqueteActualizado : paquete
        ),
        error: null,
      }));

      // Manejar entidadesRelacionadas si existen
      if (result.entidadesRelacionadas && onRelatedEntitiesUpdate) {
        onRelatedEntitiesUpdate(result.entidadesRelacionadas);
      }
      
      setOperationStates(prev => ({ ...prev, isUpdating: false }));
      return true;
    } catch (error) {
      console.error('Error al actualizar paquete:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al actualizar paquete',
      }));
      setOperationStates(prev => ({ ...prev, isUpdating: false }));
      return false;
    }
  }, [onRelatedEntitiesUpdate]);

  const deletePaquete = useCallback(async (id: string): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isDeleting: true }));
      
      const result = await api.paquetes.delete(id);
      
      // Eliminación optimista
      setState(prev => ({
        ...prev,
        data: prev.data.filter(paquete => paquete.id_paquete !== id),
        error: null,
      }));

      // Manejar entidadesRelacionadas si existen
      if (result.entidadesRelacionadas && onRelatedEntitiesUpdate) {
        onRelatedEntitiesUpdate(result.entidadesRelacionadas);
      }
      
      setOperationStates(prev => ({ ...prev, isDeleting: false }));
      return true;
    } catch (error) {
      console.error('Error al eliminar paquete:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al eliminar paquete',
      }));
      setOperationStates(prev => ({ ...prev, isDeleting: false }));
      return false;
    }
  }, [onRelatedEntitiesUpdate]);

  // ===================== OPERACIONES DE FLUJO PRINCIPAL =====================
  const assignPaquete = useCallback(async (
    paqueteId: string, 
    rutaId: string,
    conductorId?: string
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isAssigning: true }));
      
      const result = await api.paquetes.assign(paqueteId, rutaId, conductorId);
      const paqueteActualizado = result.entidadPrincipal;
      
      // Actualización optimista del estado del paquete
      setState(prev => ({
        ...prev,
        data: prev.data.map(paquete => 
          paquete.id_paquete === paqueteId ? paqueteActualizado : paquete
        ),
        error: null,
      }));

      // Manejar entidadesRelacionadas (e.g., ruta actualizada, conductor)
      if (result.entidadesRelacionadas) {
        if (onRelatedEntitiesUpdate) {
          onRelatedEntitiesUpdate(result.entidadesRelacionadas);
        }
        // Opcional: Refetch si afecta muchas entidades
        refetch();
      }
      
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return true;
    } catch (error) {
      console.error('Error al asignar paquete:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al asignar paquete',
      }));
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return false;
    }
  }, [onRelatedEntitiesUpdate, refetch]);

  const cancelAssignment = useCallback(async (
    paqueteId: string, 
    rutaId: string
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isAssigning: true }));
      
      const result = await api.paquetes.cancelAssignment(paqueteId, rutaId);
      const paqueteActualizado = result.entidadPrincipal;
      
      // Actualización optimista
      setState(prev => ({
        ...prev,
        data: prev.data.map(paquete => 
          paquete.id_paquete === paqueteId ? paqueteActualizado : paquete
        ),
        error: null,
      }));

      // Manejar entidadesRelacionadas (e.g., ruta actualizada)
      if (result.entidadesRelacionadas && onRelatedEntitiesUpdate) {
        onRelatedEntitiesUpdate(result.entidadesRelacionadas);
      }
      
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return true;
    } catch (error) {
      console.error('Error al cancelar asignación:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al cancelar asignación',
      }));
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return false;
    }
  }, [onRelatedEntitiesUpdate]);

  const reassignPaquete = useCallback(async (
    paqueteId: string, 
    nuevaRutaId: string,
    nuevoConductorId?: string,
    observacion?: string
  ): Promise<boolean> => {
    try {
      setOperationStates(prev => ({ ...prev, isAssigning: true }));
      
      const result = await api.paquetes.reassign(paqueteId, nuevaRutaId, nuevoConductorId, observacion);
      const paqueteActualizado = result.entidadPrincipal;
      
      // Actualización optimista
      setState(prev => ({
        ...prev,
        data: prev.data.map(paquete => 
          paquete.id_paquete === paqueteId ? paqueteActualizado : paquete
        ),
        error: null,
      }));

      // Manejar entidadesRelacionadas (e.g., ruta nueva, conductor)
      if (result.entidadesRelacionadas && onRelatedEntitiesUpdate) {
        onRelatedEntitiesUpdate(result.entidadesRelacionadas);
      }
      
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return true;
    } catch (error) {
      console.error('Error al reasignar paquete:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al reasignar paquete',
      }));
      setOperationStates(prev => ({ ...prev, isAssigning: false }));
      return false;
    }
  }, [onRelatedEntitiesUpdate]);

  // ===================== CAMBIOS DE ESTADO DEL FLUJO =====================
  const markEnRuta = useCallback(async (paqueteId: string): Promise<boolean> => {
    try {
      const result = await api.paquetes.markEnRuta(paqueteId);
      const paqueteActualizado = result.entidadPrincipal;
      
      // Actualización optimista
      setState(prev => ({
        ...prev,
        data: prev.data.map(paquete => 
          paquete.id_paquete === paqueteId ? paqueteActualizado : paquete
        ),
        error: null,
      }));

      // Manejar entidadesRelacionadas si existen
      if (result.entidadesRelacionadas && onRelatedEntitiesUpdate) {
        onRelatedEntitiesUpdate(result.entidadesRelacionadas);
      }
      
      return true;
    } catch (error) {
      console.error('Error al marcar paquete en ruta:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al marcar paquete en ruta',
      }));
      return false;
    }
  }, [onRelatedEntitiesUpdate]);

  const markEntregado = useCallback(async (
    paqueteId: string, 
    observacion?: string,
    imagen?: string
  ): Promise<boolean> => {
    try {
      const result = await api.paquetes.markEntregado(paqueteId, observacion, imagen);
      const paqueteActualizado = result.entidadPrincipal;
      
      // Actualización optimista
      setState(prev => ({
        ...prev,
        data: prev.data.map(paquete => 
          paquete.id_paquete === paqueteId ? paqueteActualizado : paquete
        ),
        error: null,
      }));

      // Manejar entidadesRelacionadas si existen
      if (result.entidadesRelacionadas && onRelatedEntitiesUpdate) {
        onRelatedEntitiesUpdate(result.entidadesRelacionadas);
      }
      
      return true;
    } catch (error) {
      console.error('Error al marcar paquete como entregado:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al marcar paquete como entregado',
      }));
      return false;
    }
  }, [onRelatedEntitiesUpdate]);

  const markFallido = useCallback(async (
    paqueteId: string, 
    observacion?: string
  ): Promise<boolean> => {
    try {
      const result = await api.paquetes.markFallido(paqueteId, observacion);
      const paqueteActualizado = result.entidadPrincipal;
      
      // Actualización optimista
      setState(prev => ({
        ...prev,
        data: prev.data.map(paquete => 
          paquete.id_paquete === paqueteId ? paqueteActualizado : paquete
        ),
        error: null,
      }));

      // Manejar entidadesRelacionadas si existen
      if (result.entidadesRelacionadas && onRelatedEntitiesUpdate) {
        onRelatedEntitiesUpdate(result.entidadesRelacionadas);
      }
      
      return true;
    } catch (error) {
      console.error('Error al marcar paquete como fallido:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al marcar paquete como fallido',
      }));
      return false;
    }
  }, [onRelatedEntitiesUpdate]);

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
 * Hook específico para operaciones de asignación
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
      await api.paquetes.assign(paqueteId, rutaId, conductorId);
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
      await api.paquetes.reassign(paqueteId, nuevaRutaId, nuevoConductorId, observacion);
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
      await api.paquetes.cancelAssignment(paqueteId, rutaId);
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
      await api.paquetes.markEnRuta(paqueteId);
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
      await api.paquetes.markEntregado(paqueteId, observacion, imagen);
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
      await api.paquetes.markFallido(paqueteId, observacion);
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