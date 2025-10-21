// src/hooks/admin/useRoutes.ts
import { useEffect, useState } from "react";
import { getAllRutas } from "../../../global/services/routeService";
import { Ruta } from "../../../global/types/rutas";

export const useRoutes = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]); // 👈 Tipo explícito
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const data = await getAllRutas();
        setRutas(data); // ✅ ahora data es del tipo Ruta[]
      } catch (err) {
        console.error("Error cargando rutas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRutas();
  }, []);

  return { rutas, loading };
};
