import React, { useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { Paquete, TipoPaquete } from "../../../global/types/paquete.types";
import { Plus } from "lucide-react";
import { usePackages } from "../../../hooks/admin/usePackages";
import { toast } from "sonner";

//modal para agregar paquete

interface ModalAgregarPaqueteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (payload: {
    destinatario: {
      nombre: string;
      apellido: string;
      direccion: string;
      correo: string;
      telefono: string;
    };
    tipo_paquete: TipoPaquete;
    cantidad: number;
    valor_declarado: number;
    dimensiones: {
      largo: number;
      ancho: number;
      alto: number;
      peso: number;
    };
  }) => Promise<boolean>;
  isLoading?: boolean;
}

interface FormErrors {
  nombre?: string;
  apellido?: string;
  direccion?: string;
  correo?: string;
  telefono?: string;
  cantidad?: string;
  valor_declarado?: string;
  dimensiones?: {
    largo?: string;
    ancho?: string;
    alto?: string;
    peso?: string;
  };
}

const ModalAgregarPaquete: React.FC<ModalAgregarPaqueteProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isLoading = false,
}) => {

  const { createPackage } = usePackages();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    correo: "",
    telefono: "",
    tipo_paquete: TipoPaquete.Pequeño,
    cantidad: 0,
    valor_declarado: 0,
    dimensiones: { largo: 0, ancho: 0, alto: 0, peso: 0 },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]{7,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(formData.nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(formData.apellido.trim())) {
      newErrors.apellido = "El apellido solo puede contener letras";
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    } else if (formData.direccion.trim().length < 5) {
      newErrors.direccion = "La dirección debe tener al menos 5 caracteres";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = "Formato de correo inválido";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!validatePhone(formData.telefono)) {
      newErrors.telefono = "Formato de teléfono inválido";
    }

    if (formData.cantidad < 1) {
      newErrors.cantidad = "La cantidad debe ser mayor a 0";
    } else if (formData.cantidad > 100) {
      newErrors.cantidad = "La cantidad no puede ser mayor a 100";
    }

    if (formData.valor_declarado <= 0) {
      newErrors.valor_declarado = "El valor debe ser mayor a 0";
    } else if (formData.valor_declarado > 10000000) {
      newErrors.valor_declarado = "El valor declarado es muy alto";
    }

    const dimensionesErrors: FormErrors["dimensiones"] = {};
    if (formData.dimensiones.largo <= 0) {
      dimensionesErrors.largo = "El largo debe ser mayor a 0";
    } else if (formData.dimensiones.largo > 200) {
      dimensionesErrors.largo = "Máximo 200cm";
    }

    if (formData.dimensiones.ancho <= 0) {
      dimensionesErrors.ancho = "El ancho debe ser mayor a 0";
    } else if (formData.dimensiones.ancho > 200) {
      dimensionesErrors.ancho = "Máximo 200cm";
    }

    if (formData.dimensiones.alto <= 0) {
      dimensionesErrors.alto = "El alto debe ser mayor a 0";
    } else if (formData.dimensiones.alto > 200) {
      dimensionesErrors.alto = "Máximo 200cm";
    }

    if (formData.dimensiones.peso <= 0) {
      dimensionesErrors.peso = "El peso debe ser mayor a 0";
    } else if (formData.dimensiones.peso > 50) {
      dimensionesErrors.peso = "Máximo 50kg";
    }

    if (Object.keys(dimensionesErrors).length > 0) {
      newErrors.dimensiones = dimensionesErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (["largo", "ancho", "alto", "peso"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        dimensiones: {
          ...prev.dimensiones,
          [name]: Math.max(0, Number(value)),
        },
      }));

      if (errors.dimensiones?.[name as keyof FormErrors["dimensiones"]]) {
        setErrors((prev) => ({
          ...prev,
          dimensiones: { ...prev.dimensiones, [name]: undefined },
        }));
      }
    } else if (["cantidad", "valor_declarado"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: Math.max(0, Number(value)) }));
    } else if (name === "tipo_paquete") {
      setFormData((prev) => ({
        ...prev,
        tipo_paquete: value as TipoPaquete,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    const payload = {
      destinatario: {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        direccion: formData.direccion.trim(),
        correo: formData.correo.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
      },
      tipo_paquete: formData.tipo_paquete,
      cantidad: formData.cantidad,
      valor_declarado: formData.valor_declarado,
      dimensiones: formData.dimensiones,
    };

    try {
      const success = await onSuccess(payload);
      if (success) {
        toast.success("¡Paquete creado exitosamente!");
        setFormData({
          nombre: "",
          apellido: "",
          direccion: "",
          correo: "",
          telefono: "",
          tipo_paquete: TipoPaquete.Pequeño,
          cantidad: 1,
          valor_declarado: 0,
          dimensiones: { largo: 0, ancho: 0, alto: 0, peso: 0 },
        });
        setErrors({});
        onClose();
      } else {
        toast.error("Error al crear el paquete");
      }
    } catch (error) {
      console.error("Error al crear paquete:", error);
      toast.error("Error al crear el paquete");
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Plus className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Agregar nuevo paquete
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Datos del destinatario
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre *</Label>
                <Input
                  name="nombre"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errors.nombre ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
              </div>
              <div>
                <Label>Apellido *</Label>
                <Input
                  name="apellido"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className={errors.apellido ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.apellido && (
                  <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Label>Dirección *</Label>
              <Input
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Ej: Calle 123 #45-67, Bogotá"
                className={errors.direccion ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.direccion && (
                <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Correo electrónico *</Label>
                <Input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="ejemplo@correo.com"
                  className={errors.correo ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.correo && (
                  <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
                )}
              </div>
              <div>
                <Label>Teléfono *</Label>
                <Input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="3001234567"
                  className={errors.telefono ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.telefono && (
                  <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Información del paquete
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Tipo de paquete</Label>
                <select
                  name="tipo_paquete"
                  value={formData.tipo_paquete}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  disabled={isLoading}
                >
                  {Object.values(TipoPaquete).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Cantidad *</Label>
                <Input
                  type="number"
                  name="cantidad"
                  placeholder="0"
                  value={formData.cantidad === 0 ? "" : formData.cantidad}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className={errors.cantidad ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.cantidad && (
                  <p className="text-red-500 text-xs mt-1">{errors.cantidad}</p>
                )}
              </div>
              <div>
                <Label>Valor declarado (COP)</Label>
                <Input
                  type="number"
                  name="valor_declarado"
                  placeholder="0"
                  value={formData.valor_declarado === 0 ? "" : formData.valor_declarado}
                  onChange={handleInputChange}
                  min="0"
                  step={1000}
                  className={errors.valor_declarado ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.valor_declarado && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.valor_declarado}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Dimensiones del paquete
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Largo (cm)</Label>
                <Input
                  type="number"
                  name="largo"
                  placeholder="0"
                  value={formData.dimensiones.largo === 0 ? "" : formData.dimensiones.largo}
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.dimensiones?.largo ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.dimensiones?.largo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dimensiones.largo}
                  </p>
                )}
              </div>
              <div>
                <Label>Ancho (cm)</Label>
                <Input
                  type="number"
                  name="ancho"
                  placeholder="0"
                  value={formData.dimensiones.ancho === 0 ? "" : formData.dimensiones.ancho}
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.dimensiones?.ancho ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.dimensiones?.ancho && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dimensiones.ancho}
                  </p>
                )}
              </div>
              <div>
                <Label>Alto (cm)</Label>
                <Input
                  type="number"
                  name="alto"
                  placeholder="0"
                  value={formData.dimensiones.alto === 0 ? "" : formData.dimensiones.alto}
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.dimensiones?.alto ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.dimensiones?.alto && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dimensiones.alto}
                  </p>
                )}
              </div>
              <div>
                <Label>Peso (kg)</Label>
                <Input
                  type="number"
                  name="peso"
                  placeholder="0"
                  value={formData.dimensiones.peso === 0 ? "" : formData.dimensiones.peso}
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.dimensiones?.peso ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.dimensiones?.peso && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dimensiones.peso}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? "Creando..." : "Crear paquete"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default ModalAgregarPaquete;