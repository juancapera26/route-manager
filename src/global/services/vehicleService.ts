// src/global/services/vehicleService.ts
import { 
  Vehiculo, 
  CreateVehiculoDto, 
  UpdateVehiculoDto,
  VehiculoResponse,
  VehiculosListResponse 
} from '../types/vehiclesType';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Servicio para interactuar con el API de vehículos
 * Sigue el patrón de arquitectura hexagonal
 */
export const vehicleService = {
  /**
   * Obtiene todos los vehículos
   */
  async getAll(): Promise<Vehiculo[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehiculos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener vehículos');
      }

      const data: VehiculosListResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error en getAll vehiculos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un vehículo por ID
   */
  async getById(id: string): Promise<Vehiculo> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehiculos/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener vehículo');
      }

      const data: VehiculoResponse = await response.json();
      if (!data.data) {
        throw new Error('Vehículo no encontrado');
      }
      return data.data;
    } catch (error) {
      console.error('Error en getById vehiculo:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo vehículo
   */
  async create(vehiculo: CreateVehiculoDto): Promise<Vehiculo> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehiculos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehiculo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear vehículo');
      }

      const data: VehiculoResponse = await response.json();
      if (!data.data) {
        throw new Error('Error en la respuesta del servidor');
      }
      return data.data;
    } catch (error) {
      console.error('Error en create vehiculo:', error);
      throw error;
    }
  },

  /**
   * Actualiza un vehículo existente
   */
  async update(id: string, vehiculo: UpdateVehiculoDto): Promise<Vehiculo> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehiculos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehiculo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar vehículo');
      }

      const data: VehiculoResponse = await response.json();
      if (!data.data) {
        throw new Error('Error en la respuesta del servidor');
      }
      return data.data;
    } catch (error) {
      console.error('Error en update vehiculo:', error);
      throw error;
    }
  },

  /**
   * Elimina un vehículo
   */
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehiculos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar vehículo');
      }

      return true;
    } catch (error) {
      console.error('Error en delete vehiculo:', error);
      throw error;
    }
  },

  /**
   * Cambia el estado de disponibilidad de un vehículo
   */
  async updateEstado(id: string, disponible: boolean): Promise<Vehiculo> {
    try {
      const response = await fetch(`${API_BASE_URL}/vehiculos/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disponible }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cambiar estado del vehículo');
      }

      const data: VehiculoResponse = await response.json();
      if (!data.data) {
        throw new Error('Error en la respuesta del servidor');
      }
      return data.data;
    } catch (error) {
      console.error('Error en updateEstado vehiculo:', error);
      throw error;
    }
  },
};