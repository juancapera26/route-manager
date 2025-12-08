// hooks/useUpdateAdmin.ts
import { useState } from "react";
import { updateAdmin } from "../../global/services/adminProfileService";

export const useUpdateAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAdminData = async (
    id: number,
    data: { correo?: string; telefono_movil?: string },
    token: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateAdmin(id, data, token);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateAdminData, loading, error };
};