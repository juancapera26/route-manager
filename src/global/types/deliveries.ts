// src/global/types/deliveries.ts
export interface DeliveryFormData {
  orderId: string;
  reference: string;
  content: string;
  value: number | null;
  clientName: string;
  address: string;
  phone: string;
  deliveryNotes: string;
}

export interface DeliveryFormDatapa {
  notaEntrega?: string;
  codigo?: string;
  referencia?: string;
  contenido?: string;
  valor?: number;
  direccion?: string;
  telefono?: string;
}
