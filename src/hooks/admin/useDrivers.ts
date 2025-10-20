// =============================================
// useDrivers - Hook para gestión de conductores
// =============================================
/*
import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "../../global/apis";
import {
  Conductor,
  ConductorEstado,
  Vehiculo,
  Ruta,
  Paquete,
} from "../../global/types";

// ===================== TIPOS DEL HOOK =====================
interface UseDriversConfig {
  estado?: ConductorEstado | "all";
  autoFetch?: boolean;
  refreshInterval?: number;
  includeVehicleInfo?: boolean; // Para futura extensión si la API incluye vehículo
  onRelatedEntitiesUpdate?: (related: {
    ruta?: Ruta;
    conductor?: Conductor;
    vehiculo?: Vehiculo;
    paquetes?: Paquete[];
  }) => void; // Callback opcional para manejar entidades relacionadas (e.g., sincronizar con otros hooks)
}

interface DriversState {
  data: Conductor[];
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
}

interface UseDriversActions {
  // Operaciones de estado
  updateEstado: (
    conductorId: string,
    nuevoEstado: ConductorEstado
  ) => Promise<boolean>;

  // Operaciones de asignación de rutas
  assignRuta: (conductorId: string, rutaId: string) => Promise<boolean>;

  // Obtener conductor con información extendida
  getConductorWithDetails: (conductorId: string) => Promise<Conductor | null>;

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
    estado = "all",
    autoFetch = true,
    refreshInterval,
    includeVehicleInfo = false,
    onRelatedEntitiesUpdate,
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
      setState((prev) => ({ ...prev, loading: true, error: null }));

      let conductores: Conductor[];

      if (estado !== "all") {
        conductores = await api.conductores.getByEstado(
          estado as ConductorEstado
        );
      } else {
        conductores = await api.conductores.getAll();
      }

      setState((prev) => ({
        ...prev,
        data: conductores,
        loading: false,
        lastFetch: new Date(),
      }));
    } catch (error) {
      console.error("Error al obtener conductores:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener conductores",
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
  const updateEstado = useCallback(
    async (
      conductorId: string,
      nuevoEstado: ConductorEstado
    ): Promise<boolean> => {
      try {
        setOperationStates((prev) => ({ ...prev, isUpdatingStatus: true }));

        const result = await api.conductores.updateEstado(
          conductorId,
          nuevoEstado
        );
        const conductorActualizado = result.entidadPrincipal;

        // Actualización optimista
        setState((prev) => ({
          ...prev,
          data: prev.data.map((conductor) =>
            conductor.id_conductor === conductorId
              ? { ...conductorActualizado }
              : conductor
          ),
          error: null,
        }));

        // Manejar entidadesRelacionadas si existen
        if (result.entidadesRelacionadas && onRelatedEntitiesUpdate) {
          onRelatedEntitiesUpdate(result.entidadesRelacionadas);
        }

        setOperationStates((prev) => ({ ...prev, isUpdatingStatus: false }));
        return true;
      } catch (error) {
        console.error("Error al actualizar estado del conductor:", error);
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Error al actualizar estado del conductor",
        }));
        setOperationStates((prev) => ({ ...prev, isUpdatingStatus: false }));
        return false;
      }
    },
    [onRelatedEntitiesUpdate]
  );

  // ===================== OPERACIONES DE ASIGNACIÓN =====================
  const assignRuta = useCallback(
    async (conductorId: string, rutaId: string): Promise<boolean> => {
      try {
        setOperationStates((prev) => ({ ...prev, isAssigning: true }));

        const result = await api.conductores.assignRuta(conductorId, rutaId);
        const conductorActualizado = result.entidadPrincipal;

        // Actualización optimista
        setState((prev) => ({
          ...prev,
          data: prev.data.map((conductor) =>
            conductor.id_conductor === conductorId
              ? { ...conductorActualizado }
              : conductor
          ),
          error: null,
        }));

        // Manejar entidadesRelacionadas (e.g., ruta actualizada, paquetes)
        if (result.entidadesRelacionadas) {
          if (onRelatedEntitiesUpdate) {
            onRelatedEntitiesUpdate(result.entidadesRelacionadas);
          }
          // Opcional: Refetch si afecta muchas entidades
          refetch();
        }

        setOperationStates((prev) => ({ ...prev, isAssigning: false }));
        return true;
      } catch (error) {
        console.error("Error al asignar ruta al conductor:", error);
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Error al asignar ruta al conductor",
        }));
        setOperationStates((prev) => ({ ...prev, isAssigning: false }));
        return false;
      }
    },
    [onRelatedEntitiesUpdate, refetch]
  );

  // ===================== INFORMACIÓN EXTENDIDA =====================
  // ===================== INFORMACIÓN EXTENDIDA =====================
  const getConductorWithDetails = useCallback(
    async (conductorId: string): Promise<Conductor | null> => {
      try {
        const conductor = await api.conductores.getById(conductorId);
        return conductor;
      } catch (error) {
        console.error("Error al obtener detalles del conductor:", error);
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error
              ? error.message
              : "Error al obtener detalles del conductor",
        }));
        return null;
      }
    },
    []
  );

  // ===================== UTILIDADES =====================
  const getConductorById = useCallback(
    (id: string): Conductor | undefined => {
      return state.data.find((conductor) => conductor.id_conductor === id);
    },
    [state.data]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // ===================== DATOS COMPUTADOS =====================
  const computedData = useMemo(() => {
    const conductoresDisponibles = state.data.filter(
      (c) => c.estado === ConductorEstado.Disponible
    );
    const conductoresEnRuta = state.data.filter(
      (c) => c.estado === ConductorEstado.EnRuta
    );
    const conductoresNoDisponibles = state.data.filter(
      (c) => c.estado === ConductorEstado.NoDisponible
    );

    const totalConductores = state.data.length;
    const porcentajeDisponibilidad =
      totalConductores > 0
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


 // Hook específico para obtener solo conductores disponibles
 // Útil en modales de asignación de rutas
 
export const useDriversDisponibles = () => {
  return useDrivers({ estado: ConductorEstado.Disponible });
};


 //Hook específico para monitoreo de conductores en ruta
 // Útil para dashboards de seguimiento
 
export const useDriversEnRuta = () => {
  return useDrivers({
    estado: ConductorEstado.EnRuta,
    refreshInterval: 30000, // Refresh cada 30 segundos para monitoreo
  });
};


 //Hook específico solo para operaciones de asignación
 // Más ligero para componentes que solo asignan rutas
 
export const useDriverAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignRuta = useCallback(
    async (conductorId: string, rutaId: string) => {
      try {
        setLoading(true);
        setError(null);
        await api.conductores.assignRuta(conductorId, rutaId);
        setLoading(false);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al asignar ruta";
        setError(errorMessage);
        setLoading(false);
        return false;
      }
    },
    []
  );

  const updateEstado = useCallback(
    async (conductorId: string, nuevoEstado: ConductorEstado) => {
      try {
        setLoading(true);
        setError(null);
        await api.conductores.updateEstado(conductorId, nuevoEstado);
        setLoading(false);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al actualizar estado";
        setError(errorMessage);
        setLoading(false);
        return false;
      }
    },
    []
  );

  return {
    assignRuta,
    updateEstado,
    loading,
    error,
    clearError: () => setError(null),
  };
};


 //Hook para obtener estadísticas de conductores
 // Útil para dashboards y reportes
 
export const useDriversStats = () => {
  const {
    conductoresDisponibles,
    conductoresEnRuta,
    conductoresNoDisponibles,
    totalConductores,
    porcentajeDisponibilidad,
    loading,
    error,
  } = useDrivers();

  const stats = useMemo(
    () => ({
      total: totalConductores,
      disponibles: conductoresDisponibles.length,
      enRuta: conductoresEnRuta.length,
      noDisponibles: conductoresNoDisponibles.length,
      porcentajeDisponibilidad,
      // Stats adicionales
      porcentajeEnRuta:
        totalConductores > 0
          ? Math.round((conductoresEnRuta.length / totalConductores) * 100)
          : 0,
    }),
    [
      totalConductores,
      conductoresDisponibles.length,
      conductoresEnRuta.length,
      conductoresNoDisponibles.length,
      porcentajeDisponibilidad,
    ]
  );

  return {
    stats,
    loading,
    error,
  };
};

// ===================== EXPORT DEFAULT =====================
export default useDrivers;*/
