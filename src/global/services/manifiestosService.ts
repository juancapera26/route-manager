// src/services/manifiestosService.ts

import { API_URL } from "../../config";
import { Paquete } from "../types/paquete.types";

export interface ManifiestoResponse {
  codigo: string;
  paquetes: Paquete[];
}

export class ManifiestosService {
  static async getManifiesto(
    codigo: string,
    token: string
  ): Promise<ManifiestoResponse> {
    if (!token) throw new Error("Usuario no autenticado");

    const res = await fetch(`${API_URL}/api/manifiestos/${codigo}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 403) {
      throw new Error(
        "No tienes permiso para ver los paquetes de este manifiesto."
      );
    }
    if (res.status === 404) {
      throw new Error("No se encontró el manifiesto con ese código.");
    }
    if (!res.ok) {
      throw new Error("Error al consultar el manifiesto.");
    }

    const data: ManifiestoResponse = await res.json();

    if (!data.paquetes || data.paquetes.length === 0) {
      throw new Error("No se encontraron paquetes para este manifiesto.");
    }

    return data;
  }
}
