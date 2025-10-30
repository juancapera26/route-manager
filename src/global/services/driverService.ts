import axios from "axios";
import { UpdateConductorDto } from "../types/conductores";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface ConductorUpdated {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  foto_perfil?: string;
}

// Actualizar datos generales
export const updateConductor = async (
  id: number,
  data: UpdateConductorDto,
  token: string
): Promise<ConductorUpdated> => {
  const url = `${API_BASE_URL}/conductores/${id}`;
  const response = await axios.put<ConductorUpdated>(url, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Actualizar foto del conductor
export const updateFotoPerfil = async (
  id: number,
  file: File,
  token: string
): Promise<ConductorUpdated> => {
  const url = `${API_BASE_URL}/conductores/${id}/foto`;
  const formData = new FormData();
  formData.append("foto", file);

  const response = await axios.patch<ConductorUpdated>(url, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Actualizar solo teléfono
export const updateTelefono = async (
  id: number,
  telefono: string,
  token: string
): Promise<ConductorUpdated> => {
  const url = `${API_BASE_URL}/conductores/${id}/telefono`;
  const response = await axios.patch<ConductorUpdated>(
    url,
    { telefono },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
// Eliminar conductor
export const deleteConductor = async (
  id: number,
  token: string
): Promise<void> => {
  const url = `${API_BASE_URL}/conductores/${id}`;
  await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
