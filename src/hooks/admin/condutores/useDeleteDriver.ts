import { useState } from "react";
import { deleteConductor } from "../../../global/services/driverService";
import useAuth from "../../useAuth";

function isAxiosError(
  err: unknown
): err is { response?: { data?: { message?: string } } } {
  return typeof err === "object" && err !== null && "response" in err;
}

export default function useDeleteDriver(refetch: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth();

  const handleDeleteDriver = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessToken();
      if (!token) throw new Error("Token no disponible");

      await deleteConductor(id, token);
      await refetch();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        // Ya TypeScript sabe que err tiene 'response?.data?.message'
        setError(
          err.response?.data?.message || "Error al eliminar el conductor"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al eliminar el conductor");
      }

      console.error("Error al eliminar conductor:", err);
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteDriver, loading, error };
}
