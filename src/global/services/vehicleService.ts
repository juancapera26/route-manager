// src/global/services/vehicleService.ts
import { API_URL } from "../../config";
import {
  Vehiculo,
  CreateVehiculoDto,
  UpdateVehiculoDto,
  VehiculoResponse,
  VehiculosListResponse,
} from "../types/vehiclesType";

const API_BASE = `${API_URL}/vehiculos`;

/**
 * Servicio para interactuar con el API de vehículos
 * Sigue el patrón de arquitectura hexagonal
 */
export const vehicleService = {
  async getAll(): Promise<Vehiculo[]> {
    try {
      const response = await fetch(API_BASE, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al obtener vehículos");
      const data: VehiculosListResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error en getAll vehiculos:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<Vehiculo> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al obtener vehículo");
      const data: VehiculoResponse = await response.json();
      if (!data.data) throw new Error("Vehículo no encontrado");
      return data.data;
    } catch (error) {
      console.error("Error en getById vehiculo:", error);
      throw error;
    }
  },

  async create(vehiculo: CreateVehiculoDto): Promise<Vehiculo> {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehiculo),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear vehículo");
      }
      const data: VehiculoResponse = await response.json();
      if (!data.data) throw new Error("Error en la respuesta del servidor");
      return data.data;
    } catch (error) {
      console.error("Error en create vehiculo:", error);
      throw error;
    }
  },

  async update(id: string, vehiculo: UpdateVehiculoDto): Promise<Vehiculo> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehiculo),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar vehículo");
      }
      const data: VehiculoResponse = await response.json();
      if (!data.data) throw new Error("Error en la respuesta del servidor");
      return data.data;
    } catch (error) {
      console.error("Error en update vehiculo:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar vehículo");
      }
      return true;
    } catch (error) {
      console.error("Error en delete vehiculo:", error);
      throw error;
    }
  },

  async updateEstado(id: string, disponible: boolean): Promise<Vehiculo> {
    try {
      const response = await fetch(`${API_BASE}/${id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponible }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al cambiar estado del vehículo"
        );
      }
      const data: VehiculoResponse = await response.json();
      if (!data.data) throw new Error("Error en la respuesta del servidor");
      return data.data;
    } catch (error) {
      console.error("Error en updateEstado vehiculo:", error);
      throw error;
    }
  },
};
