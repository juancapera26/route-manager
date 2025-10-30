// global/types/paquete.types.ts

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

// 🔹 Interfaz completa del paquete (lo que retorna el backend)
export interface Paquete {
  id_paquete: number;
  codigo_rastreo?: string | null;
  fecha_registro: string;
  fecha_entrega?: string | null;
  estado: PaquetesEstados;
  tipo_paquete: TipoPaquete;
  
  dimensiones: {
    largo: number;
    ancho: number;
    alto: number;
    peso: number;
  };
  
  cantidad: number;
  valor_declarado: number;
  
  // ✅ Dirección de entrega específica del paquete (puede ser diferente a la del cliente)
  direccion_entrega?: string | null;
  lat?: number | null;
  lng?: number | null;
  
  // Relaciones
  id_cliente: number;
  id_ruta?: number | null;
  id_barrio?: number | null;
  
  // ✅ Info del cliente/destinatario (viene de la relación)
  cliente?: {
    id_cliente: number;
    nombre: string;
    apellido: string;
    direccion: string;      // ← Dirección registrada del cliente
    correo: string;
    telefono_movil: string; // ← Nota: en Prisma es telefono_movil, no telefono
  };
  
  barrio?: {
    id_barrio: number;
    nombre: string;
  };
}

// 🔹 Para CREAR un paquete (incluye datos del cliente)
export interface PaqueteCreate {
  // Datos del destinatario (se crea en la tabla cliente)
  destinatario: {
    nombre: string;
    apellido: string;
    direccion: string;      // ← Se guarda en cliente.direccion
    correo: string;
    telefono: string;       // ← Se guarda en cliente.telefono_movil
  };
  
  // Datos del paquete
  tipo_paquete: TipoPaquete;
  cantidad: number;
  valor_declarado: number;
  dimensiones: {
    largo: number;
    ancho: number;
    alto: number;
    peso: number;
  };
  
  // ✅ Dirección de entrega (opcional, si es diferente a la del cliente)
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
  dimensiones?: {
    largo: number;
    ancho: number;
    alto: number;
    peso: number;
  };
  estado?: PaquetesEstados;
  direccion_entrega?: string | null;
  lat?: number;
  lng?: number;
  id_barrio?: number;
  observacion_conductor?: string;
  imagen_adjunta?: string;
}

export interface AsignarPaqueteDTO {
  id_ruta: number;
  id_conductor: number;
}