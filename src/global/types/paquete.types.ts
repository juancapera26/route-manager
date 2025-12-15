// global/types/paquete.types.ts

//tipos de paquetes

export enum PaquetesEstados {
  Pendiente = "Pendiente",
  Asignado = "Asignado",
  Entregado = "Entregado",
  Fallido = "Fallido",
}

export enum TipoPaquete {
  Pequeño = "Pequeno",
  Mediano = "Mediano",
  Grande = "Grande",
  Refrigerado = "Refrigerado",
  Fragil = "Fragil",
}

// ← NUEVAS INTERFACES PARA RELACIONES
export interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  direccion: string;
  correo: string;
  telefono_movil: string;
}

export interface Conductor {
  id_conductor: number;
  nombre: string;
  apellido: string;
}

export interface Ruta {
  id_ruta: number;
  nombre?: string;
  descripcion?: string;
  estado_ruta: string;
  conductor?: Conductor;
}

export interface Barrio {
  id_barrio: number;
  nombre: string;
}

// 🔹 Interfaz completa del paquete (lo que retorna el backend)
export interface Paquete {
  id_paquete: number;
  codigo_rastreo?: string | null;
  fecha_registro: string;
  fecha_entrega?: string | null;
  estado: PaquetesEstados;
  tipo_paquete: TipoPaquete;

  // Dimensiones
  largo: number;
  ancho: number;
  alto: number;
  peso: number;

  cantidad: number;
  valor_declarado: number;

  direccion_entrega?: string | null;
  lat?: number | null;
  lng?: number | null;

  id_cliente: number;
  id_ruta?: number | null;
  id_barrio?: number | null;

  // 🔹 RELACIONES
  cliente?: Cliente;
  ruta?: Ruta;
  barrio?: Barrio;

  // ✅ CAMPOS DEL REMITENTE (NUEVOS)
  remitente_nombre?: string | null;
  remitente_apellido?: string | null;
  remitente_telefono?: string | null;
  remitente_correo?: string | null;
  remitente_empresa?: string | null;
}


// 🔹 Para CREAR un paquete (incluye datos del cliente)
export interface PaqueteCreate {

  remitente: {
    remitente_nombre: string;
    remitente_apellido: string;
    remitente_telefono: string;
    remitente_correo: string;
    remitente_empresa?: string;
  };

  destinatario: {
    nombre: string;
    apellido: string;
    direccion: string;
    correo: string;
    telefono: string;
  };
  
  tipo_paquete: TipoPaquete;
  cantidad: number;
  valor_declarado: number;
  dimensiones: {
    largo: number;
    ancho: number;
    alto: number;
    peso: number;
  };
  
  direccion_entrega?: string;
  lat?: number;
  lng?: number;
  id_barrio?: number;
}

// 🔹 Para ACTUALIZAR un paquete
export interface PaqueteUpdate {
  tipo_paquete?: TipoPaquete;
  cantidad?: number;
  valor_declarado?: number;
  largo?: number;
  ancho?: number;
  alto?: number;
  peso?: number;
  estado?: PaquetesEstados;
  direccion_entrega?: string | null;
  lat?: number;
  lng?: number;
  id_barrio?: number;
  observacion_conductor?: string;
  imagen_adjunta?: string;
  fecha_entrega?: string;
  id_ruta?: number | null;
}

export interface AsignarPaqueteDTO {
  id_ruta?: number;
  cod_manifiesto: string;
  id_conductor?: number;
}