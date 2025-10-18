// src/components/admin/packages/ModalEditarPaquete.tsx
import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Alert from "../../ui/alert/Alert";
import { Paquete, TipoPaquete, PaqueteUpdate } from "../../../global/types/paquete.types";
import { Edit } from "lucide-react";

interface ModalEditarPaqueteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: number, payload: PaqueteUpdate) => Promise<boolean>;
  paquete: Paquete | null;
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

const ModalEditarPaquete: React.FC<ModalEditarPaqueteProps> = ({
  isOpen,
  onClose,
  onSuccess,
  paquete,
  isLoading = false,
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
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

  // Estados para validación y mensajes
  const [errors, setErrors] = useState<FormErrors>({});
  const [mensaje, setMensaje] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // ✅ FIX: Efecto para pre-poblar el formulario cuando se abre el modal
  useEffect(() => {
    if (paquete && isOpen) {
      console.log('🔄 Pre-poblando formulario con datos del paquete:', paquete.id_paquete);
      
      // ✅ CAMBIO: Usar paquete.cliente en lugar de paquete.destinatario
      if (paquete.cliente) {
        setFormData({
          nombre: paquete.cliente.nombre,
          apellido: paquete.cliente.apellido,
          direccion: paquete.cliente.direccion,
          correo: paquete.cliente.correo,
          telefono: paquete.cliente.telefono_movil, // ← Nota: es telefono_movil en el backend
          tipo_paquete: paquete.tipo_paquete,
          cantidad: paquete.cantidad,
          valor_declarado: paquete.valor_declarado,
          dimensiones: paquete.dimensiones,
        });
      }
      
      // Limpiar errores y mensajes al abrir
      setErrors({});
      setMensaje(null);
    }
  }, [paquete, isOpen]);

  // Funciones de validación
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

    // Validación del nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(formData.nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras";
    }

    // Validación del apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    } else if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(formData.apellido.trim())) {
      newErrors.apellido = "El apellido solo puede contener letras";
    }

    // Validación de la dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    } else if (formData.direccion.trim().length < 5) {
      newErrors.direccion = "La dirección debe tener al menos 5 caracteres";
    }

    // Validación del correo
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = "Formato de correo inválido";
    }

    // Validación del teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!validatePhone(formData.telefono)) {
      newErrors.telefono = "Formato de teléfono inválido";
    }

    // Validación de la cantidad
    if (formData.cantidad < 1) {
      newErrors.cantidad = "La cantidad debe ser mayor a 0";
    } else if (formData.cantidad > 100) {
      newErrors.cantidad = "La cantidad no puede ser mayor a 100";
    }

    // Validación del valor declarado
    if (formData.valor_declarado <= 0) {
      newErrors.valor_declarado = "El valor debe ser mayor a 0";
    } else if (formData.valor_declarado > 10000000) {
      newErrors.valor_declarado = "El valor declarado es muy alto";
    }

    // Validación de las dimensiones
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

  // Handler para cambios en los inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Limpiar error del campo que está siendo editado
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Manejar campos de dimensiones
    if (["largo", "ancho", "alto", "peso"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        dimensiones: {
          ...prev.dimensiones,
          [name]: Math.max(0, Number(value)),
        },
      }));
      
      // Limpiar error específico de dimensiones
      if (errors.dimensiones?.[name as keyof FormErrors["dimensiones"]]) {
        setErrors((prev) => ({
          ...prev,
          dimensiones: { ...prev.dimensiones, [name]: undefined },
        }));
      }
    } 
    // Manejar campos numéricos
    else if (["cantidad", "valor_declarado"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: Math.max(0, Number(value)) }));
    } 
    // Manejar tipo de paquete
    else if (name === "tipo_paquete") {
      setFormData((prev) => ({
        ...prev,
        tipo_paquete: value as TipoPaquete,
      }));
    } 
    // Manejar campos de texto
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ FIX: Handler para el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paquete) {
      setMensaje({ text: "No hay paquete seleccionado", type: "error" });
      return;
    }

    if (!validateForm()) {
      setMensaje({
        text: "Por favor corrige los errores en el formulario",
        type: "error",
      });
      return;
    }

    // ✅ CAMBIO: Construir payload usando PaqueteUpdate (solo datos del paquete)
    // NOTA: Los datos del cliente NO se actualizan desde aquí
    // Solo se pueden actualizar: tipo_paquete, cantidad, valor_declarado, dimensiones
    const payload: PaqueteUpdate = {
      tipo_paquete: formData.tipo_paquete,
      cantidad: formData.cantidad,
      valor_declarado: formData.valor_declarado,
      dimensiones: formData.dimensiones,
    };

    console.log('📤 Enviando actualización del paquete:', {
      id: paquete.id_paquete,
      payload,
    });

    try {
      const success = await onSuccess(paquete.id_paquete, payload);
      
      if (success) {
        setMensaje({ text: "Paquete actualizado exitosamente", type: "success" });
        setErrors({});
        
        // Cerrar el modal después de un breve delay para mostrar el mensaje
        setTimeout(() => {
          setMensaje(null);
          onClose();
        }, 1500);
      } else {
        setMensaje({ text: "Error al actualizar paquete", type: "error" });
      }
    } catch (error) {
      console.error("Error al actualizar paquete:", error);
      setMensaje({ text: "Error al actualizar paquete", type: "error" });
    }
  };

  // Handler para cerrar el modal
  const handleClose = () => {
    if (!isLoading) {
      setMensaje(null);
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="max-w-2xl mx-auto">
        {/* Header del modal */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Edit className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Editar paquete
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
          {/* ⚠️ Sección: Datos del destinatario (SOLO LECTURA) */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-yellow-300 dark:border-yellow-600">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Datos del destinatario
              </h4>
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded">
                Solo lectura
              </span>
            </div>
            
            {/* Nombre y apellido */}
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

            {/* Dirección */}
            <div className="mt-4">
              <Label>Dirección</Label>
              <Input
                name="direccion"
                value={formData.direccion}
                disabled
                className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Correo y teléfono */}
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

          {/* ✅ Sección: Información del paquete (EDITABLE) */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Información del paquete
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tipo de paquete */}
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

              {/* Cantidad */}
              <div>
                <Label>Cantidad *</Label>
                <Input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
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

              {/* Valor declarado */}
              <div>
                <Label>Valor declarado (COP)</Label>
                <Input
                  type="number"
                  name="valor_declarado"
                  value={formData.valor_declarado}
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

          {/* ✅ Sección: Dimensiones del paquete (EDITABLE) */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Dimensiones del paquete
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Largo */}
              <div>
                <Label>Largo (cm)</Label>
                <Input
                  type="number"
                  name="largo"
                  value={formData.dimensiones.largo}
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

              {/* Ancho */}
              <div>
                <Label>Ancho (cm)</Label>
                <Input
                  type="number"
                  name="ancho"
                  value={formData.dimensiones.ancho}
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

              {/* Alto */}
              <div>
                <Label>Alto (cm)</Label>
                <Input
                  type="number"
                  name="alto"
                  value={formData.dimensiones.alto}
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

              {/* Peso */}
              <div>
                <Label>Peso (kg)</Label>
                <Input
                  type="number"
                  name="peso"
                  value={formData.dimensiones.peso}
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

          {/* Botones de acción */}
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