/**
 * Tipos de Ruta - Integración con módulo de paquetes
 * Basado en el modelo Prisma y campos usados en ModalAsignarPaquete
 */

// Estados posibles de una ruta según Prisma (ajusta si hay más)
export enum EstadoRuta {
  Pendiente = 'Pendiente',
  Activa = 'Activa',
  Completada = 'Completada',
  Cancelada = 'Cancelada',
}

// Representación base de una Ruta en la BD
export interface RutaBase {
  id_ruta: number;
  estado_ruta: EstadoRuta | string;
  fecha_inicio: string; // Prisma DateTime → string en JSON
  fecha_fin?: string | null;
  id_conductor: number;
  id_vehiculo: number;
  cod_manifiesto: string;

  // Relaciones (pueden omitirse o usarse según la carga del backend)
  usuario?: {
    id_usuario: number;
    nombre?: string;
  };
  vehiculo?: {
    id_vehiculo: number;
    placa?: string;
  };
  paquete?: any[]; // TODO: reemplazar por tipo Paquete cuando esté disponible
}

// 🔹 Campos adicionales usados por el frontend (modal)
export interface RutaFrontendExtras {
  horario?: {
    inicio: string;
    fin: string;
  };
  zona?: string;
  paquetes_asignados?: any[];
  id_conductor_asignado?: boolean;
}

// 🔸 Tipo final que combina ambos
export type Ruta = RutaBase & RutaFrontendExtras;
