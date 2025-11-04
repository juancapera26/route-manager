import axios from "axios";
import { Conductor, UpdateConductorDto } from "../types/conductores";
import { API_URL } from "../../config";

export interface ConductorUpdated {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  foto_perfil?: string;
}

// Obtener conductores en ruta
export const getConductoresEnRuta = async (
  token: string
): Promise<Conductor[]> => {
  const url = `${API_URL}/conductores/en-ruta`;
  const response = await axios.get<Conductor[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Actualizar datos generales
export const updateConductor = async (
  id: number,
  data: UpdateConductorDto,
  token: string
): Promise<ConductorUpdated> => {
  const url = `${API_URL}/conductores/${id}`;
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
  const url = `${API_URL}/conductores/${id}/foto`;
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
  const url = `${API_URL}/conductores/${id}/telefono`;
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
  const url = `${API_URL}/conductores/${id}`;
  await axios.delete(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
