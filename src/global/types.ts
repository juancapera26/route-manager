// Empresa
export enum Empresa {
  Servientrega = "Servientrega",
}

// Paquetes
// =====================
export interface Destinatario {
  nombre: string;
  apellido: string;
  direccion: string;
  correo: string;
  telefono: string;
}

export interface PaquetesDimensiones {
  largo: number; // cm
  ancho: number; // cm
  alto: number; // cm
  peso: number; // kg
}

export enum PaquetesEstados {
  Pendiente = "Pendiente",
  Asignado = "Asignado",
  EnRuta = "En ruta",
  Entregado = "Entregado",
  Fallido = "Fallido",
}

export enum TipoPaquete {
  Grande = "Grande",
  Mediano = "Mediano",
  Pequeño = "Pequeño",
  Fragil = "Fragil",
  Refrigerado = "Refrigerado",
}

export interface Paquete {
  // Info de la tabla
  id_paquete: string;
  id_rutas_asignadas: string[]; // puede pasar por varias rutas
  id_conductor_asignado: string | null;
  destinatario: Destinatario;
  fecha_registro: string; // ISO
  fecha_entrega: string | null;

  // Detalle del paquete
  estado: PaquetesEstados;
  tipo_paquete: TipoPaquete;
  cantidad: number;
  valor_declarado: number;
  dimensiones: PaquetesDimensiones;

  // Detalles adicionales Para paquetes entregados
  observacion_conductor?: string;
  imagen_adjunta?: string;
}

// Conductores
// =====================
export enum ConductorEstado {
  Disponible = "Disponible",
  EnRuta = "En ruta",
  NoDisponible = "No disponible",
}

export interface HorarioConductor {
  inicio: string; // ISO
  fin: string; // ISO
}

export interface Conductor {
  // Info de la tabla
  id_conductor: string;
  nombre: string;
  apellido: string;
  estado: ConductorEstado;
  horario?: HorarioConductor;
  id_vehiculo_asignado?: string;

  // Detalles del conductor
  nombre_empresa: Empresa;
  correo: string;
  telefono: string;
  tipo_documento: string;
  documento: string;
}

// Rutas
// =====================
export enum RutaEstado {
  Pendiente = "Pendiente",
  Asignada = "Asignada",
  Completada = "Completada",
  Fallida = "Fallida",
}

export interface HorarioRuta {
  inicio: string; // ISO
  fin: string; // ISO
}

export enum ZonaRuta {
  Sur = "Sur",
  Centro = "Centro",
  Norte = "Norte",
}

export interface Ruta {
  // Info de la tabla
  id_ruta: string;
  id_conductor_asignado: string | null;
  paquetes_asignados: string[]; // array de ids de paquetes
  horario: HorarioRuta;
  zona: ZonaRuta;
  fecha_registro: string; // ISO
  estado: RutaEstado;

  // Detalles de la ruta
  puntos_entrega: string;
}

// Vehículos
// =====================
export enum VehiculoEstado {
  Disponible = "Disponible",
  NoDisponible = "No disponible",
}

export type TipoVehiculo = "Camión" | "Furgón" | "Camioneta" | "Moto";

export interface Vehiculo {
  // Info de la tabla
  id_vehiculo: string;
  placa: string;
  tipo_vehiculo: TipoVehiculo;
  estado: VehiculoEstado;
  fecha_mantenimiento: string; // ISO
}