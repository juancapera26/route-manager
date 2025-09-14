// src/pages/driver/ModalReporte.d.ts
export interface Reporte {
  id?: string;
  descripcion: string;
  archivo?: File | null;
  fecha: string;
  estado: "pendiente" | "enviado" | "rechazado";
}
