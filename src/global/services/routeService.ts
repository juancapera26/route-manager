// src/global/services/routeService.ts
import axios from "axios";
import { Ruta } from "../types/rutas";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getAllRutas = async (): Promise<Ruta[]> => {
  try {
    const response = await axios.get<Ruta[]>(`${API_URL}/rutas`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener rutas:", error);
    throw error;
  }
};
