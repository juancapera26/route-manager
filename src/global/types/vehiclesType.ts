// src/global/types/vehiclesType.ts

// Enums basados en tu schema de Prisma
export enum TipoVehiculo {
  Camioneta = "camioneta",
  Moto = "moto",
  Furgon = "furgon",
  Camion = "camion"
}

export enum EstadoVehiculo {
  Disponible = "Disponible",
  NoDisponible = "No disponible"
}

// Interfaz principal del vehículo
export interface Vehiculo {
  id_vehiculo: string;
  placa: string;
  tipo: TipoVehiculo;
  estado_vehiculo: EstadoVehiculo;
}

// DTOs para crear/actualizar
export interface CreateVehiculoDto {
  placa: string;
  tipo: TipoVehiculo;
  estado_vehiculo?: EstadoVehiculo;
}

export interface UpdateVehiculoDto {
  placa?: string;
  tipo?: TipoVehiculo;
  estado_vehiculo?: EstadoVehiculo;
}

// Tipos para filtros
export type VehiculosFiltro = {
  tipo?: TipoVehiculo;
  estado?: EstadoVehiculo;
  search?: string;
};

// Respuestas del API
export interface VehiculoResponse {
  success: boolean;
  message: string;
  data?: Vehiculo;
}

export interface VehiculosListResponse {
  success: boolean;
  message: string;
  data: Vehiculo[];
}