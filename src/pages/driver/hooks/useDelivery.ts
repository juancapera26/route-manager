import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { createDelivery } from "../../../global/services/deliveryService";
import { DeliveryFormData } from "../../../global/types/deliveries";

type UseDeliveryParams = {
  initial?: Partial<DeliveryFormData>;
  onSubmitSuccess?: () => void;
  onClose?: () => void;
};

export function useDelivery({
  initial,
  onSubmitSuccess,
  onClose,
}: UseDeliveryParams = {}) {
  // ✅ Estado principal del formulario: inicia vacío
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

  // 🔹 Cargar datos del paquete seleccionado
  useEffect(() => {
    if (initial) {
      setFormData((prev) => ({
        ...prev,
        ...initial,
      }));
    }
  }, [initial]);

  // 🔹 Manejar cambios de texto
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 🔹 Manejar archivo (foto)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDeliveryPhoto(e.target.files[0]);
    } else {
      setDeliveryPhoto(null);
    }
  };

  // 🔹 Función para limpiar solo la foto (usada al cerrar modal)
  const clearPhoto = () => setDeliveryPhoto(null);

  // 🔹 Validación simple
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.deliveryNotes.length > 350) {
      newErrors.deliveryNotes = "Las notas no pueden exceder 350 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Confirmar entrega
  const handleConfirm = () => {
    if (validateForm()) setShowConfirmModal(true);
  };

  // 🔹 Enviar entrega
  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    const result = await createDelivery(formData, deliveryPhoto);
    setLoading(false);

    if (result.ok) {
      onSubmitSuccess?.();
      onClose?.();
      // limpiar campos editables
      setFormData((prev) => ({ ...prev, deliveryNotes: "" }));
      setDeliveryPhoto(null);
    } else {
      console.error("Error al crear entrega:", result.error);
      setErrors({ ...errors, submit: result.error ?? "Error desconocido" });
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
    clearPhoto, // 👈 exportamos para usar en el componente
  };
}

export default useDelivery;
