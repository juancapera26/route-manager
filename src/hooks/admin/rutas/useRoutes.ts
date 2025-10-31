// src/hooks/admin/useRoutes.ts
import { useEffect, useState } from "react";
import { getAllRutas } from "../../../global/services/routeService";
import { Ruta } from "../../../global/types/rutas";

export const useRoutes = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para obtener las rutas
  const fetchRutas = async () => {
    setLoading(true); // Asegúrate de que se marque como cargando
    try {
      const data = await getAllRutas();  // Obtener las rutas
      setRutas(data);  // Establecer las rutas en el estado
    } catch (err) {
      console.error("Error cargando rutas:", err);
    } finally {
      setLoading(false); // Marcar como no cargando
    }
  };

  // Ejecutar la carga de rutas cuando se monta el componente
  useEffect(() => {
    fetchRutas();
  }, []);

  // Retornar las rutas, el estado de carga, y la función refetch
  return { rutas, loading, refetch: fetchRutas };
};
