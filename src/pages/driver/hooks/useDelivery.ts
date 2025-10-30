import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { PackagesService } from "../../../global/services/packageService";
import { DeliveryFormData } from "../../../global/types/deliveries";

type UseDeliveryParams = {
  initial?: Partial<DeliveryFormData>;
  onSubmitSuccess?: () => void;
  onClose?: () => void;
  id_paquete?: number;
};

type SubmitResult = {
  ok: boolean;
  error?: string;
};

export function useDelivery({
  initial,
  onSubmitSuccess,
  onClose,
  id_paquete,
}: UseDeliveryParams = {}) {
  const [formData, setFormData] = useState<DeliveryFormData>({
    orderId: "",
    reference: "",
    content: "",
    value: null,
    clientName: "",
    address: "",
    phone: "",
    deliveryNotes: "",
  });

  const [deliveryPhoto, setDeliveryPhoto] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setFormData((prev) => ({ ...prev, ...initial }));
    }
  }, [initial]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDeliveryPhoto(e.target.files[0]);
    } else {
      setDeliveryPhoto(null);
    }
  };

  const clearPhoto = () => setDeliveryPhoto(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.deliveryNotes.length > 350) {
      newErrors.deliveryNotes = "Las notas no pueden exceder 350 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validateForm()) setShowConfirmModal(true);
  };

  // 🔹 Corrección: extraemos solo números del orderId
  const handleFinalSubmit = async (): Promise<SubmitResult> => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      if (!id_paquete) throw new Error("ID de paquete no definido");

      await PackagesService.registrarEntrega(
        id_paquete,
        "Entregado",
        formData.deliveryNotes,
        deliveryPhoto || undefined
      );

      setLoading(false);
      onSubmitSuccess?.();
      onClose?.();
      setFormData((prev) => ({ ...prev, deliveryNotes: "" }));
      setDeliveryPhoto(null);

      return { ok: true };
    } catch (err: unknown) {
      setLoading(false);
      console.error("Error al registrar entrega:", err);
      const message = err instanceof Error ? err.message : String(err);
      setErrors({ ...errors, submit: message || "Error desconocido" });
      return { ok: false, error: message };
    }
  };

  return {
    formData,
    deliveryPhoto,
    showConfirmModal,
    loading,
    errors,
    setShowConfirmModal,
    handleInputChange,
    handleFileChange,
    handleConfirm,
    handleFinalSubmit,
    clearPhoto,
  };
}

export default useDelivery;
