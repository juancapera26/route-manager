import { mapApiToPaquete } from "../../adapters/paquete.adapter";
import {
  Paquete,
  AsignarPaqueteDTO,
  PaqueteCreate,
  PaqueteUpdate,
} from "../../global/types/paquete.types";
import { API_URL } from "../../config";

const API_BASE = `${API_URL}/paquetes`;

export const PackagesService = {
  
  async getAll(): Promise<Paquete[]> {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Error al obtener los paquetes");
    const data = await res.json();
    return data.map(mapApiToPaquete);
  },

  async getOne(id: number): Promise<Paquete> {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) throw new Error(`Error al obtener el paquete con ID ${id}`);
    const data = await res.json();
    return mapApiToPaquete(data);
  },

  async create(paquete: PaqueteCreate): Promise<Paquete> {
    console.log("🚀 Enviando al backend:", paquete);
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paquete),
    });
    if (!res.ok) throw new Error("Error al crear el paquete");
    const data = await res.json();
    return mapApiToPaquete(data);
  },

  async update(id: number, paquete: PaqueteUpdate): Promise<Paquete> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paquete),
    });
    if (!res.ok) throw new Error(`Error al actualizar el paquete ${id}`);
    const data = await res.json();
    return mapApiToPaquete(data);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error al eliminar el paquete ${id}`);
  },


  async asignar(id: number, dto: AsignarPaqueteDTO): Promise<Paquete> {
    const res = await fetch(`${API_BASE}/${id}/asignar`, {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `Error al asignar el paquete ${id}`);
    }

    const data = await res.json();
    return mapApiToPaquete(data);
  },

  async cambiarEstado(id: number, estado: string): Promise<Paquete> {
    const res = await fetch(`${API_BASE}/${id}/estado`, {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    if (!res.ok) {
      throw new Error(`Error al cambiar el estado del paquete ${id}`);
    }
    const data = await res.json();
    return mapApiToPaquete(data);
  },

  async registrarEntrega(
    id: number,
    estado_paquete: string,
    observacion_entrega?: string,
    imagen?: File
  ): Promise<Paquete> {
    const formData = new FormData();
    formData.append("estado_paquete", estado_paquete);

    if (observacion_entrega)
      formData.append("observacion_entrega", observacion_entrega);
    if (imagen) formData.append("imagen", imagen);

    const res = await fetch(`${API_BASE}/${id}/entrega`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Error al registrar la entrega del paquete ${id}`);
    }

    const data = await res.json();
    return mapApiToPaquete(data);
  },

  // ← NUEVO: Obtener rutas disponibles para asignar
  async getRutasDisponibles(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/rutas-disponibles`);
    if (!res.ok) {
      throw new Error("Error al obtener rutas disponibles");
    }
    return await res.json();
  },

  // ← NUEVO: Obtener paquetes de una ruta específica
  async getPaquetesByRuta(id_ruta: number): Promise<Paquete[]> {
    const res = await fetch(`${API_BASE}/ruta/${id_ruta}`);
    if (!res.ok) {
      throw new Error(`Error al obtener paquetes de la ruta ${id_ruta}`);
    }
    const data = await res.json();
    return data.map(mapApiToPaquete);
  },

  // ← NUEVO: Cancelar asignación (volver a Pendiente)
  async cancelarAsignacion(id: number): Promise<Paquete> {
    const res = await fetch(`${API_BASE}/${id}/cancelar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Error al cancelar la asignación del paquete ${id}`);
    }

    const data = await res.json();
    return mapApiToPaquete(data);
  },

  // ← NUEVO: Reasignar paquete a otra ruta
  async reasignar(id: number, dto: AsignarPaqueteDTO): Promise<Paquete> {
    const res = await fetch(`${API_BASE}/${id}/reasignar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `Error al reasignar el paquete ${id}`);
    }

    const data = await res.json();
    return mapApiToPaquete(data);
  },

  // ← NUEVO: Obtener paquetes por estado
  async getPaquetesByEstado(estado: string): Promise<Paquete[]> {
    const res = await fetch(`${API_BASE}/estado/${estado}`);
    if (!res.ok) {
      throw new Error(`Error al obtener paquetes con estado ${estado}`);
    }
    const data = await res.json();
    return data.map(mapApiToPaquete);
  },
};