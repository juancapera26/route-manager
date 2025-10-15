// src/global/services/deliveryService.ts

import { DeliveryFormData } from "../types/deliveries";

export type CreateDeliveryResult = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

export async function createDelivery(
  formData: DeliveryFormData,
  photo?: File | null
): Promise<CreateDeliveryResult> {
  const submitData = new FormData();
  submitData.append("orderData", JSON.stringify(formData));
  if (photo) submitData.append("deliveryPhoto", photo);

  try {
    const response = await fetch("/api/entregas", {
      method: "POST",
      body: submitData,
    });

    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: text || "Error en la petición" };
    }

    const data = await response.json().catch(() => null);
    return { ok: true, data };
  } catch (error: unknown) {
    console.error("createDelivery error:", error);
    return { ok: false, error: String(error) };
  }
}
