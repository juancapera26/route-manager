import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { Conductor } from "../../global/types/conductores";

export default function useDriver() {
  const [data, setData] = useState<Conductor[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAccessToken, user } = useAuth();

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        console.warn("No se encontró token de acceso, deteniendo fetch.");
        setLoading(false);
        return;
      }

      // 👇 Tipamos la respuesta como Conductor[]
      const res = await axios.get<Conductor[]>(
        "http://localhost:3000/conductores",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 👇 Transformamos los datos sin usar `any`
      const conductores = res.data.map((c) => ({
        ...c,
        nombre_empresa: c.empresa?.nombre_empresa ?? "Sin empresa",
      }));

      setData(conductores);
    } catch (err) {
      console.error("Error al cargar conductores", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDrivers();
    } else {
      setLoading(false);
    }
  }, [user]);

  return { data, loading, refetch: fetchDrivers };
}
