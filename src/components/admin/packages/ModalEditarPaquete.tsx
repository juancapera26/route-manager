// src/components/admin/packages/ModalEditarPaquete.tsx
import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { Paquete, TipoPaquete, PaqueteUpdate } from "../../../global/types/paquete.types";
import { Edit } from "lucide-react";
import { toast } from "sonner";

//modal para editar paquete

interface ModalEditarPaqueteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: number, payload: PaqueteUpdate) => Promise<boolean>;
  paquete: Paquete | null;
  isLoading?: boolean;
}

interface FormErrors {
  cantidad?: string;
  valor_declarado?: string;
  largo?: string;
  ancho?: string;
  alto?: string;
  peso?: string;
}

const ModalEditarPaquete: React.FC<ModalEditarPaqueteProps> = ({
  isOpen,
  onClose,
  onSuccess,
  paquete,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    correo: "",
    telefono: "",
    tipo_paquete: TipoPaquete.Pequeño,
    cantidad: 1,
    valor_declarado: 0,
    // ← CAMBIO: Dimensiones como propiedades directas
    largo: 0,
    ancho: 0,
    alto: 0,
    peso: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (paquete && isOpen) {
      if (paquete.cliente) {
        setFormData({
          nombre: paquete.cliente.nombre,
          apellido: paquete.cliente.apellido,
          direccion: paquete.cliente.direccion,
          correo: paquete.cliente.correo,
          telefono: paquete.cliente.telefono_movil,
          tipo_paquete: paquete.tipo_paquete,
          cantidad: paquete.cantidad,
          valor_declarado: paquete.valor_declarado,
          // ← CAMBIO: Asignar dimensiones directamente
          largo: paquete.largo,
          ancho: paquete.ancho,
          alto: paquete.alto,
          peso: paquete.peso,
        });
      }
      setErrors({});
    }
  }, [paquete, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    // ← CAMBIO: Validaciones de dimensiones directas
    if (formData.largo <= 0) {
      newErrors.largo = "El largo debe ser mayor a 0";
    } else if (formData.largo > 200) {
      newErrors.largo = "Máximo 200cm";
    }

    if (formData.ancho <= 0) {
      newErrors.ancho = "El ancho debe ser mayor a 0";
    } else if (formData.ancho > 200) {
      newErrors.ancho = "Máximo 200cm";
    }

    if (formData.alto <= 0) {
      newErrors.alto = "El alto debe ser mayor a 0";
    } else if (formData.alto > 200) {
      newErrors.alto = "Máximo 200cm";
    }

    if (formData.peso <= 0) {
      newErrors.peso = "El peso debe ser mayor a 0";
    } else if (formData.peso > 50) {
      newErrors.peso = "Máximo 50kg";
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

    // ← CAMBIO: Manejo simplificado de dimensiones
    if (["largo", "ancho", "alto", "peso"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: Math.max(0, Number(value)),
      }));
    } 
    else if (["cantidad", "valor_declarado"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: Math.max(0, Number(value)) }));
    } 
    else if (name === "tipo_paquete") {
      setFormData((prev) => ({
        ...prev,
        tipo_paquete: value as TipoPaquete,
      }));
    } 
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paquete) {
      toast.error("No hay paquete seleccionado");
      return;
    }

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    // ← CAMBIO: Payload con dimensiones como propiedades directas
    const payload: PaqueteUpdate = {
      tipo_paquete: formData.tipo_paquete,
      cantidad: formData.cantidad,
      valor_declarado: formData.valor_declarado,
      largo: formData.largo,
      ancho: formData.ancho,
      alto: formData.alto,
      peso: formData.peso,
    };

    try {
      const success = await onSuccess(paquete.id_paquete, payload);
      
      if (success) {
        toast.success("¡Paquete actualizado exitosamente!");
        setErrors({});
        onClose();
      } else {
        toast.error("Error al actualizar el paquete");
      }
    } catch (error) {
      console.error("Error al actualizar paquete:", error);
      toast.error("Error al actualizar el paquete");
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
            <Edit className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Editar paquete
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos del destinatario (solo lectura) */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-yellow-300 dark:border-yellow-600">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Datos del destinatario
              </h4>
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded">
                Solo lectura
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  name="nombre"
                  value={formData.nombre}
                  disabled
                  className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Los datos del cliente no se pueden editar aquí
                </p>
              </div>
              
              <div>
                <Label>Apellido</Label>
                <Input
                  name="apellido"
                  value={formData.apellido}
                  disabled
                  className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Dirección</Label>
              <Input
                name="direccion"
                value={formData.direccion}
                disabled
                className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Correo electrónico</Label>
                <Input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  disabled
                  className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>
              
              <div>
                <Label>Teléfono</Label>
                <Input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  disabled
                  className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Información del paquete */}
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

          {/* Dimensiones del paquete */}
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
                  value={formData.largo === 0 ? "" : formData.largo}
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.largo ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.largo && (
                  <p className="text-red-500 text-xs mt-1">{errors.largo}</p>
                )}
              </div>

              <div>
                <Label>Ancho (cm)</Label>
                <Input
                  type="number"
                  name="ancho"
                  placeholder="0"
                  value={formData.ancho === 0 ? "" : formData.ancho}
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.ancho ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.ancho && (
                  <p className="text-red-500 text-xs mt-1">{errors.ancho}</p>
                )}
              </div>

              <div>
                <Label>Alto (cm)</Label>
                <Input
                  type="number"
                  name="alto"
                  placeholder="0"
                  value={formData.alto === 0 ? "" : formData.alto}
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.alto ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.alto && (
                  <p className="text-red-500 text-xs mt-1">{errors.alto}</p>
                )}
              </div>

              <div>
                <Label>Peso (kg)</Label>
                <Input
                  type="number"
                  name="peso"
                  placeholder="0"
                  value={formData.peso === 0 ? "" : formData.peso}
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.peso ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.peso && (
                  <p className="text-red-500 text-xs mt-1">{errors.peso}</p>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
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
              {isLoading ? "Actualizando..." : "Actualizar paquete"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalEditarPaquete;