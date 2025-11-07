import axios from "axios";
import {
  Ruta,
  CreateRutaDto,
  CambiarEstadoRutaDto,
  AsignarConductorDto,
} from "../types/rutas";
import { API_URL } from "../../config";

console.log("🔧 API_URL configurada:", API_URL);

// Obtener todas las rutas
export const getAllRutas = async (): Promise<Ruta[]> => {
  try {
    const response = await axios.get<Ruta[]>(`${API_URL}/rutas`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error al obtener rutas:", error.message);
    } else {
      console.error("❌ Error desconocido al obtener rutas");
    }
    throw error;
  }
};

// Crear nueva ruta
export const createRuta = async (data: CreateRutaDto): Promise<Ruta> => {
  try {
    const response = await axios.post<Ruta>(`${API_URL}/rutas`, data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Error al crear ruta:", error.message);
    } else {
      console.error("❌ Error desconocido al crear ruta");
    }
    throw error;
  }
};

// Cambiar estado de ruta
export const cambiarEstadoRuta = async (
  id: number,
  data: CambiarEstadoRutaDto
): Promise<Ruta> => {
  const url = `${API_URL}/rutas/${id}/estado`;

  const payload = { nuevoEstado: data.estado_ruta };

  console.log("🚀 Enviando PATCH a:", url, "con data:", payload);

  try {
    const response = await axios.patch<Ruta>(url, payload);
    console.log("✅ Respuesta del backend:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `❌ Error al cambiar estado de la ruta ${id}:`,
        error.message
      );
    } else {
      console.error(`❌ Error desconocido al cambiar estado de la ruta ${id}`);
    }
    throw error;
  }
};

// Asignar conductor a una ruta
export const asignarConductor = async (
  id: number,
  data: AsignarConductorDto
): Promise<Ruta> => {
  const url = `${API_URL}/rutas/${id}/asignar-conductor`;
  const idConductor =
    typeof data.id_conductor === "string"
      ? parseInt(data.id_conductor, 10)
      : data.id_conductor;

  const dataWithCorrectType = { ...data, id_conductor: idConductor };

  console.log("🚀 Enviando PATCH a:", url, "con data:", dataWithCorrectType);

  try {
    const response = await axios.patch<Ruta>(url, dataWithCorrectType);
    console.log(" Conductor asignado:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        ` Error al asignar conductor a la ruta ${id}:`,
        error.message
      );
    } else {
      console.error(` Error desconocido al asignar conductor a la ruta ${id}`);
    }
    throw error;
  }
};

// Asignar vehículo a una ruta
export const asignarVehiculo = async (
  idRuta: number,
  idVehiculo: number
): Promise<any> => {
  const url = `${API_URL}/rutas/${idRuta}/asignar-vehiculo`;
  console.log("🚀 Enviando PATCH a:", url, "con id_vehiculo:", idVehiculo);

  try {
    const response = await axios.patch(url, { id_vehiculo: idVehiculo });
    console.log("✅ Vehículo asignado:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `❌ Error al asignar vehículo a la ruta ${idRuta}:`,
        error.message
      );
    } else {
      console.error(
        `❌ Error desconocido al asignar vehículo a la ruta ${idRuta}`
      );
    }
    throw error;
  }
};

// Eliminar ruta
export const deleteRuta = async (id: number): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/rutas/${id}`);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(` Error al eliminar la ruta ${id}:`, error.message);
    } else {
      console.error(` Error desconocido al eliminar la ruta ${id}`);
    }
    throw error;
  }
};
