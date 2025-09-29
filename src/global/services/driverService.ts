// src/global/services/driverService.ts
import axios from "axios";
import { UpdateConductorDto } from "../types/conductores";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface ConductorUpdated {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  foto_perfil?: string;
  // otros campos según tu modelo
}

// Actualización general del conductor (PATCH normal)
export const updateConductor = async (
  id: number,
  data: UpdateConductorDto,
  token: string
): Promise<ConductorUpdated> => {
  const url = `${API_BASE_URL}/conductores/${id}`;
  console.log("URL de actualización del conductor:", url); // Log de la URL
  console.log("Datos a enviar:", data); // Log de los datos

  const response = await axios.patch<ConductorUpdated>(url, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Respuesta del servidor:", response.data); // Log de la respuesta del servidor
  return response.data;
};

// Actualización de la foto de perfil (subida de archivo)
export const updateFotoPerfil = async (
  id: number,
  file: File,
  token: string
): Promise<ConductorUpdated> => {
  const formData = new FormData();
  formData.append("foto", file);

  const url = `${API_BASE_URL}/conductores/${id}/foto`;
  console.log("URL de actualización de foto:", url); // Log de la URL
  console.log("Archivo a subir:", file.name); // Log del archivo

  const response = await axios.patch<ConductorUpdated>(url, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("Respuesta del servidor (Foto):", response.data); // Log de la respuesta del servidor
  return response.data;
};
