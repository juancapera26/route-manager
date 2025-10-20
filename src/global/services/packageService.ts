import { mapApiToPaquete } from "../../adapters/paquete.adapter";
import {Paquete ,AsignarPaqueteDTO, PaqueteCreate, PaqueteUpdate } from "../../global/types/paquete.types";

// API real del backend

const API_URL = "http://localhost:3000/paquetes";

export const PackagesService = {

  //CRUD BASICA
  async getAll(): Promise<Paquete[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener los paquetes");
    const data = await res.json();
    return data.map(mapApiToPaquete);
  },

  async getOne(id: number): Promise<Paquete> {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(`Error al obtener el paquete con ID ${id}`);
    const data = await res.json();
    return mapApiToPaquete(data);
  },

  async create(paquete: PaqueteCreate): Promise<Paquete> {
    console.log('🚀 Enviando al backend:', paquete);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paquete),
    });
    if (!res.ok) throw new Error("Error al crear el paquete");
    const data = await res.json();
    return mapApiToPaquete(data);
  },

  async update(id: number, paquete: PaqueteUpdate): Promise<Paquete> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paquete),
    });
    if (!res.ok) throw new Error(`Error al actualizar el paquete ${id}`);
    const data = await res.json();
    return mapApiToPaquete(data);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Error al eliminar el paquete ${id}`);
  },

  // Funciones adicionales

  async asignar(id: number, dto: AsignarPaqueteDTO): Promise<Paquete> {
    const res = await fetch(`${API_URL}/${id}/asignar`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!res.ok) throw new Error(`Error al asignar el paquete ${id}`);

    const data = await res.json();
    return mapApiToPaquete(data);
  },

  async cambiarEstado(id: number, estado: string): Promise<Paquete> {
    const res = await fetch(`${API_URL}/${id}/estado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    if (!res.ok) throw new Error(`Error al cambiar el estado del paquete ${id}`);
    const data = await res.json();
    return mapApiToPaquete(data);
  },
};
