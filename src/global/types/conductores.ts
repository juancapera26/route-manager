// src/global/types/conductores.ts
export interface UpdateConductorDto {
  telefono?: string;
  vehiculo?: string;
  foto_perfil?: File | string; // agrega otros campos que quieras permitir actualizar
}
