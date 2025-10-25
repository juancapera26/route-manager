// src/global/types/conductores.ts

// DTO que se usa para enviar cambios al API
export interface UpdateConductorDto {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  vehiculo?: string;
  foto_perfil?: File | string;
  nombre_empresa?: string;
}
export interface Empresa {
  id_empresa: number;
  nombre_empresa: string;
}
// Tipo completo del conductor que viene del backend
export interface Conductor {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  vehiculo?: string;
  foto_perfil?: string;
  estado?: string;
  empresa?: Empresa;
  nombre_empresa?: string;
}
