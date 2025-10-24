// src/global/services/routeService.ts
import axios from "axios";
import { Ruta, CreateRutaDto, CambiarEstadoRutaDto } from "../types/rutas";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

console.log("🔧 API_URL configurada:", API_URL);

// Obtener todas las rutas
export const getAllRutas = async (): Promise<Ruta[]> => {
  try {
    const response = await axios.get<Ruta[]>(`${API_URL}/rutas`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error al obtener rutas:", error.message);
    } else {
      console.error("❌ Error desconocido al obtener rutas");
    }
    throw error;
  }
};

// Crear nueva ruta
export const createRuta = async (data: CreateRutaDto): Promise<Ruta> => {
  try {
    const response = await axios.post<Ruta>(`${API_URL}/rutas`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error al crear ruta:", error.message);
    } else {
      console.error("❌ Error desconocido al crear ruta");
    }
    throw error;
  }
};

// Cambiar estado de ruta
export const cambiarEstadoRuta = async (
  id: number,
  data: CambiarEstadoRutaDto
): Promise<Ruta> => {
  const url = `${API_URL}/rutas/${id}/estado`;
  console.log("🚀 Enviando PATCH a:", url, "con data:", data);

  try {
    const response = await axios.patch<Ruta>(url, data);
    console.log("✅ Respuesta del backend:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `❌ Error al cambiar estado de la ruta ${id}:`,
        error.message
      );
    } else {
      console.error(`❌ Error desconocido al cambiar estado de la ruta ${id}`);
    }
    throw error;
  }
};

// Eliminar ruta
export const deleteRuta = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/rutas/${id}`);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`❌ Error al eliminar la ruta ${id}:`, error.message);
    } else {
      console.error(`❌ Error desconocido al eliminar la ruta ${id}`);
    }
    throw error;
  }
};
