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
