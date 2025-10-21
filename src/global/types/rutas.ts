// src/global/types/rutas.ts

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

  // ✅ Array de paquetes asignados a la ruta
  paquete?: {
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

// 👇 Nuevo tipo para el formulario
export interface RutaFormData {
  zona: ZonaRuta;
  horario: {
    inicio: string;
    fin: string;
  };
  puntos_entrega: string;
}

export enum RutaEstado {
  Pendiente = "Pendiente",
  Asignada = "Asignada",
  Completada = "Completada",
  Fallida = "Fallida",
}

export enum ZonaRuta {
  Sur = "Sur",
  Centro = "Centro",
  Norte = "Norte",
}
