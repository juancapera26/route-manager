// src/modules/novedades/services/novedadService.ts
import { Novedad } from "../types/novedades";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const novedadService = {
  // Obtener todas las novedades
  async getAll(): Promise<Novedad[]> {
    const res = await fetch(`${API_URL}/reportes`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error al obtener novedades: ${text}`);
    }

    return await res.json();
  },
};
