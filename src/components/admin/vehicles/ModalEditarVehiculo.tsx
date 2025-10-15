// src/components/admin/vehicles/ModalEditarVehiculo.tsx
import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Alert from "../../ui/alert/Alert";
import { Vehiculo, TipoVehiculo, UpdateVehiculoDto } from "../../../global/types/vehiclesType";
import { Edit } from "lucide-react";

interface ModalEditarVehiculoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: string, data: UpdateVehiculoDto) => Promise<boolean>;
  vehiculo: Vehiculo | null;
  isLoading?: boolean;
}

interface FormErrors {
  placa?: string;
  tipo?: string;
}

const ModalEditarVehiculo: React.FC<ModalEditarVehiculoProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vehiculo,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateVehiculoDto>({
    placa: "",
    tipo: TipoVehiculo.Moto,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [mensaje, setMensaje] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  /**
   * Pre-poblar el formulario cuando se abre el modal
   */
  useEffect(() => {
    if (vehiculo && isOpen) {
      console.log('🔄 Pre-poblando formulario con datos del vehículo:', vehiculo.id_vehiculo);
      setFormData({
        placa: vehiculo.placa,
        tipo: vehiculo.tipo,
      });
      setErrors({});
      setMensaje(null);
    }
  }, [vehiculo, isOpen]);

  /**
   * Validar el formato de la placa
   */
  const validarPlaca = (placa: string): boolean => {
    const placaRegex = /^[A-Z]{3}[0-9]{3}$/;
    return placaRegex.test(placa.toUpperCase());
  };

  /**
   * Validar formulario
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.placa?.trim()) {
      newErrors.placa = "La placa es requerida";
    } else if (!validarPlaca(formData.placa)) {
      newErrors.placa = "Formato de placa inválido (Ej: ABC123)";
    }

    if (formData.tipo && !Object.values(TipoVehiculo).includes(formData.tipo)) {
      newErrors.tipo = "Debe seleccionar un tipo de vehículo válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Manejar cambios en los inputs
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name === "tipo") {
      setFormData((prev) => ({ ...prev, tipo: value as TipoVehiculo }));
    } else if (name === "placa") {
      setFormData((prev) => ({ ...prev, placa: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehiculo) {
      setMensaje({ text: "No hay vehículo seleccionado", type: "error" });
      return;
    }

    if (!validateForm()) {
      setMensaje({
        text: "Por favor corrige los errores en el formulario",
        type: "error",
      });
      return;
    }

    console.log('📤 Enviando actualización del vehículo:', {
      id: vehiculo.id_vehiculo,
      formData,
    });

    try {
      const success = await onSuccess(vehiculo.id_vehiculo, formData);
      
      if (success) {
        setMensaje({ text: "Vehículo actualizado exitosamente", type: "success" });
        setErrors({});
        
        setTimeout(() => {
          setMensaje(null);
          onClose();
        }, 1500);
      } else {
        setMensaje({ text: "Error al actualizar vehículo", type: "error" });
      }
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
      setMensaje({ text: "Error al actualizar vehículo", type: "error" });
    }
  };

  /**
   * Manejar cierre del modal
   */
  const handleClose = () => {
    if (!isLoading) {
      setMensaje(null);
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Edit className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Editar vehículo
          </h3>
        </div>

        {/* Mensaje de estado */}
        {mensaje && (
          <Alert
            variant={mensaje.type}
            title={mensaje.type === "success" ? "Éxito" : "Error"}
            message={mensaje.text}
            className="mb-4"
          />
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del vehículo */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Información del vehículo
            </h4>

            <div className="space-y-4">
              {/* Placa */}
              <div>
                <Label>Placa *</Label>
                <Input
                  name="placa"
                  value={formData.placa}
                  onChange={handleInputChange}
                  placeholder="ABC123"
                  maxLength={6}
                  className={errors.placa ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.placa && (
                  <p className="text-red-500 text-xs mt-1">{errors.placa}</p>
                )}
                <p className="text-gray-400 text-xs mt-1">
                  Formato: 3 letras + 3 números (Ej: ABC123)
                </p>
              </div>

              {/* Tipo de vehículo */}
              <div>
                <Label>Tipo de vehículo *</Label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {Object.values(TipoVehiculo).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.tipo && (
                  <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="bg-yellow-50 dark:bg-yellow-500/10 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Nota:</strong> Para cambiar el estado de disponibilidad del vehículo, 
              usa el botón de estado en la tabla de vehículos.
            </p>
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
              {isLoading ? "Actualizando..." : "Actualizar vehículo"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalEditarVehiculo;