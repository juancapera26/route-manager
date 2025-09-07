import { useState } from "react";


export interface Paquete {
  codigo_rastreo: string;
  direccion: string;
  largo: number;
  ancho: number;
  alto: number;
  peso: number;
  estado_paquete: string;
  tipo_paquete: string;
}

interface ApiResponse {
  codigo: string;
  paquetes: Paquete[];
}


export function useManifiestos() {
  const [data, setData] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Llamada a la API
  const fetchManifiesto = async (codigo: string): Promise<Paquete[]> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:3000/api/manifiestos/${codigo}`
      );
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
