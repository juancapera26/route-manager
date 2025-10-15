// src/hooks/admin/useVehicles.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  Vehiculo, 
  CreateVehiculoDto, 
  UpdateVehiculoDto,
  EstadoVehiculo,
  TipoVehiculo,
  VehiculosFiltro
} from '../../global/types/vehiclesType';
import { vehicleService } from '../../global/services/vehicleService';

interface UseVehiclesOptions {
  autoFetch?: boolean;
  filtros?: VehiculosFiltro;
}

interface UseVehiclesReturn {
  // Datos
  data: Vehiculo[];
  loading: boolean;
  error: string | null;

  // Listas filtradas
  vehiculosDisponibles: Vehiculo[];
  vehiculosNoDisponibles: Vehiculo[];
  vehiculosPorTipo: (tipo: TipoVehiculo) => Vehiculo[];

  // Operaciones CRUD
  createVehiculo: (data: CreateVehiculoDto) => Promise<boolean>;
  updateVehiculo: (id: string, data: UpdateVehiculoDto) => Promise<boolean>;
  deleteVehiculo: (id: string) => Promise<boolean>;
  cambiarEstado: (id: string, disponible: boolean) => Promise<boolean>;

  // Utilidades
  refetch: () => Promise<void>;
  clearError: () => void;
  getVehiculoById: (id: string) => Vehiculo | undefined;
}

export const useVehicles = (options: UseVehiclesOptions = {}): UseVehiclesReturn => {
  const { autoFetch = true, filtros = {} } = options;

  // Estados principales
  const [data, setData] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene todos los vehículos del servidor
   */
  const fetchVehiculos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const vehiculos = await vehicleService.getAll();
      setData(vehiculos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar vehículos';
      setError(errorMessage);
      console.error('Error fetching vehiculos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear un nuevo vehículo
   */
  const createVehiculo = useCallback(async (vehiculoData: CreateVehiculoDto): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const nuevoVehiculo = await vehicleService.create(vehiculoData);
      setData(prev => [...prev, nuevoVehiculo]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear vehículo';
      setError(errorMessage);
      console.error('Error creating vehiculo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualizar un vehículo existente
   */
  const updateVehiculo = useCallback(async (id: string, vehiculoData: UpdateVehiculoDto): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const vehiculoActualizado = await vehicleService.update(id, vehiculoData);
      setData(prev => prev.map(v => v.id_vehiculo === id ? vehiculoActualizado : v));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar vehículo';
      setError(errorMessage);
      console.error('Error updating vehiculo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Eliminar un vehículo
   */
  const deleteVehiculo = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await vehicleService.delete(id);
      setData(prev => prev.filter(v => v.id_vehiculo !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar vehículo';
      setError(errorMessage);
      console.error('Error deleting vehiculo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cambiar el estado de disponibilidad de un vehículo
   */
  const cambiarEstado = useCallback(async (id: string, disponible: boolean): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const vehiculoActualizado = await vehicleService.updateEstado(id, disponible);
      setData(prev => prev.map(v => v.id_vehiculo === id ? vehiculoActualizado : v));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado';
      setError(errorMessage);
      console.error('Error changing estado vehiculo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Obtener vehículo por ID
   */
  const getVehiculoById = useCallback((id: string): Vehiculo | undefined => {
    return data.find(v => v.id_vehiculo === id);
  }, [data]);

  // Listas filtradas con useMemo para optimización
  const vehiculosDisponibles = data.filter(v => v.estado_vehiculo === EstadoVehiculo.Disponible);
  const vehiculosNoDisponibles = data.filter(v => v.estado_vehiculo === EstadoVehiculo.NoDisponible);

  const vehiculosPorTipo = useCallback((tipo: TipoVehiculo): Vehiculo[] => {
    return data.filter(v => v.tipo === tipo);
  }, [data]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    if (autoFetch) {
      fetchVehiculos();
    }
  }, [autoFetch, fetchVehiculos]);

  return {
    // Datos
    data,
    loading,
    error,

    // Listas filtradas
    vehiculosDisponibles,
    vehiculosNoDisponibles,
    vehiculosPorTipo,

    // Operaciones CRUD
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    cambiarEstado,

    // Utilidades
    refetch: fetchVehiculos,
    clearError,
    getVehiculoById,
  };
};