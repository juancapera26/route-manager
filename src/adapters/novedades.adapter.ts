// src/adapters/novedadesAdapter.ts
import { Novedad } from "../global/types/novedades";

export const adaptNovedades = (data: any[]): Novedad[] => {
  return data.map((item) => ({
    id_reporte: item.id,
    descripcion: item.descripcion,
    fecha_reporte: item.fecha,
    tipo: item.tipo,
    id_usuario: item.id_usuario,
    imagen: item.imagen || undefined,
    usuario: item.usuario
      ? {
          nombre: item.usuario.nombre,
          apellido: item.usuario.apellido,
        }
      : undefined,
  }));
};
