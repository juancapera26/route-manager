import { useState } from "react";
import { API_URL } from "../config";

// 👇 Tipos que deben coincidir con los del backend
export interface Paquete {
  id_paquete: number;
  codigo_rastreo: string | null;
  direccion: string | null;
  largo: number;
  ancho: number;
  alto: number;
  peso: number;
  estado_paquete: string; // Prisma enum: paquete_estado_paquete
  tipo_paquete: string; // Prisma enum: paquete_tipo_paquete
  lat?: number | null;
  lng?: number | null;
  valor_declarado: number;
  cantidad: number;
  fecha_registro: string; // Date → string al venir del backend
  fecha_entrega: string | null;
  id_cliente: number;
  id_ruta?: number | null;
  id_barrio?: number | null;
  ruta?: {
    id_conductor: number | null;
  } | null;
}

interface ApiResponse {
  codigo: string;
  paquetes: Paquete[];
}

export function useManifiestos() {
  const [data, setData] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchManifiesto = async (codigo: string): Promise<Paquete[]> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/manifiestos/${codigo}`);
      if (!res.ok) throw new Error("Manifiesto no encontrado");

      const result: ApiResponse = await res.json();

      if (!result.paquetes || result.paquetes.length === 0)
        throw new Error("Manifiesto no encontrado");

      setData(result.paquetes);
      return result.paquetes;
    } catch (err) {
      setData([]);
      setError(err instanceof Error ? err.message : "Error inesperado");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchManifiesto };
}
