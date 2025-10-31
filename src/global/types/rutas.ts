// ----------------- Rutas -----------------
export interface Ruta {
  id_ruta: number;
  estado_ruta: RutaEstado;
  fecha_inicio: string;
  fecha_fin?: string | null;
  id_conductor?: number | null;
  id_vehiculo?: number | null;
  cod_manifiesto?: string | null;
  fecha_creacion: string;

  usuario?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    correo: string;
  } | null;

  vehiculo?: {
    id_vehiculo: number;
    placa: string;
    tipo: string;
    estado_vehiculo: string;
  } | null;

  paquete?: {
    cliente: Cliente;
    direccion_entrega: DireccionEntrega;
    id_paquete: number;
    codigo_rastreo?: string | null;
    estado_paquete:
      | "Pendiente"
      | "Asignado"
      | "En_ruta"
      | "Entregado"
      | "Fallido";
    cantidad: number;
    destinatario?: {
      nombre: string;
      apellido: string;
      telefono?: string;
      direccion?: string;
    };
  }[];
}

// ----------------- Formularios -----------------
export interface RutaFormData {
  puntos_entrega: string;
  id_conductor?: number | null; // Agregado como opcional
  id_vehiculo?: number | null; // Agregado como opcional
  // ... otras propiedades si es necesario
}

// ----------------- DTO para crear ruta -----------------
export interface CreateRutaDto {
  ruta_estado?: RutaEstado; // opcional, backend usa "Pendiente" por defecto
  fecha_inicio?: string; // ISO string
  fecha_fin?: string; // ISO string opcional
  id_conductor?: number | null; // Cambiado para permitir null o no asignar valor
  id_vehiculo?: number | null; // Cambiado para permitir null o no asignar valor
  cod_manifiesto?: string;
}

// ----------------- DTO para cambiar estado -----------------
export interface CambiarEstadoRutaDto {
  estado_ruta: RutaEstado;
}

// ----------------- DTO para asignar conductor -----------------
export interface AsignarConductorDto {
  id_conductor: number;
}

// ----------------- Enums -----------------
export enum RutaEstado {
  Pendiente = "Pendiente",
  Asignada = "Asignada",
  En_ruta = "En_ruta",
  Completada = "Completada",
  Fallida = "Fallida",
}

export enum ZonaRuta {
  Sur = "Sur",
  Centro = "Centro",
  Norte = "Norte",
}

export interface Cliente {
  id_cliente?: number;
  nombre: string;
  apellido?: string;
  telefono?: string | null;
  correo?: string | null;
  tipo?: string | null;
  direccion?: string | null;
}

export interface DireccionEntrega {
  calle?: string;
  numero?: string;
  ciudad?: string;
  departamento?: string;
  complemento?: string | null;
}
