import { useEffect, useState } from "react";
import { novedadService } from "../../global/services/novedadesService";
import { Novedad } from "../../global/types/novedades";
import { adaptNovedades } from "../../adapters/novedades.adapter";

export const useNovedades = () => {
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNovedades = async () => {
    try {
      setLoading(true);
      const data = await novedadService.getAll();
      console.log("Novedades desde el backend:", data);

      // ✅ Adaptamos los datos del backend al formato del front
      const adaptadas = adaptNovedades(data);
      setNovedades(adaptadas);

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Error al obtener las novedades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNovedades();
  }, []);

  return {
    novedades,
    loading,
    error,
    refetch: fetchNovedades,
  };
};
