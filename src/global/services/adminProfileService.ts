// adminProfileService.ts
import { API_URL } from "../../config";

export const updateAdmin = async (
  id: number,
  data: { correo?: string; telefono_movil?: string },
  token: string
) => {
  console.log("📡 URL completa:", `${API_URL}/administradores/${id}`);
  console.log("📡 Datos enviados:", data);
  
  const response = await fetch(`${API_URL}/administradores/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  console.log("📡 Status de respuesta:", response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("📡 Error del servidor:", errorData);
    throw new Error(errorData.message || "Error al actualizar administrador");
  }

  return response.json();
};