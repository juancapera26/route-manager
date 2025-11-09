import {
  CrearUbicacionData,
  CrearUbicacionResult,
  GetUbicacionesResult,
  Ubicacion,
} from "../types/ubicaciones.types";

import { API_URL } from "../../config";

/**
 * Guarda la ubicación actual del conductor
 */
export async function createUbicacion(
  data: CrearUbicacionData
): Promise<CrearUbicacionResult> {
  try {
    const response = await fetch(`${API_URL}/ubicaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text || "Error al registrar ubicación" };
    }

    const result = await response.json().catch(() => null);
    return { ok: true, data: result };
  } catch (error: unknown) {
    console.error("createUbicacion error:", error);
    return { ok: false, error: String(error) };
  }
}

/**
 * Obtiene todas las ubicaciones registradas por una ruta
 */
export async function getUbicacionesByRuta(
  id_ruta: number
): Promise<GetUbicacionesResult> {
  try {
    const response = await fetch(`${API_URL}/ubicaciones/${id_ruta}`);

    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text || "Error al obtener ubicaciones" };
    }

    // Casteamos explícitamente data como Ubicacion[]
    const data: Ubicacion[] = await response.json();
    return { ok: true, data };
  } catch (error: unknown) {
    console.error("getUbicacionesByRuta error:", error);
    return { ok: false, error: String(error) };
  }
}
