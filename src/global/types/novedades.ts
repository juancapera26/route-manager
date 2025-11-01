// src/global/types/novedades.types.ts
export interface Novedad {
  id_reporte: number;
  descripcion: string;
  fecha_reporte: string; // renombrado para coincidir con el backend
  tipo: string; // ej. 'Logística' o 'Operativa'
  id_usuario: number;
  imagen?: string;
  usuario?: {
    nombre: string;
    apellido: string;
  };
}

export enum NovedadesTipo {
  Logistica = "Logística",
  Operativa = "Operativa",
}
