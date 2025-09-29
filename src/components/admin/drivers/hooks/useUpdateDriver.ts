// src/hooks/admin/useDrivers.ts
import { useState } from "react";
import { updateConductor } from "../../../../global/services/driverService";
import { UpdateConductorDto } from "../../../../global/types/conductores";

export const useUpdateDriver = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDriver = async (
    id: number,
    data: UpdateConductorDto,
    token: string
  ) => {
    if (!id || isNaN(id)) {
      throw new Error("El ID del conductor es inválido");
    }

    setLoading(true);
    setError(null);

    try {
      // Mapea solo los campos que vas a actualizar
      const payload: Partial<UpdateConductorDto> = {
        telefono: data.telefono,
        foto_perfil: data.foto_perfil, // 👈 ahora soporta foto de perfil
      };

      const result = await updateConductor(id, payload, token);

      setLoading(false);
      return result;
    } catch (err: unknown) {
      let message = "Error al actualizar conductor";

      if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      setLoading(false);
      throw err;
    }
  };

  return { updateDriver, loading, error };
};
