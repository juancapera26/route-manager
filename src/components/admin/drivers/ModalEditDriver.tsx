import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Alert from "../../ui/alert/Alert";
import { Edit } from "lucide-react";
import {
  Conductor,
  UpdateConductorDto,
} from "../../../global/types/conductores";

interface ModalEditarConductorProps {
  isOpen: boolean;
  onClose: () => void;
  conductor?: Conductor | null;
  onSave: (data: UpdateConductorDto) => void;
  isLoading?: boolean;
}

const ModalEditarConductor: React.FC<ModalEditarConductorProps> = ({
  isOpen,
  onClose,
  conductor,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateConductorDto>({
    nombre: "",
    apellido: "",
    telefono: "",
    nombre_empresa: "",
  });

  const [mensaje, setMensaje] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (conductor && isOpen) {
      setFormData({
        nombre: conductor.nombre || "",
        apellido: conductor.apellido || "",
        telefono: conductor.telefono || "",
        nombre_empresa: conductor.nombre_empresa || "",
      });
      setMensaje(null);
    }
  }, [conductor, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.nombre?.trim() || !formData.apellido?.trim()) {
      setMensaje({
        text: "El nombre y apellido son obligatorios",
        type: "error",
      });
      return;
    }

    onSave(formData);
    setMensaje({
      text: "Conductor actualizado correctamente",
      type: "success",
    });

    setTimeout(() => {
      setMensaje(null);
      onClose();
    }, 1200);
  };

  const handleClose = () => {
    setMensaje(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {/* 🧩 Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Edit className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Editar Conductor
        </h3>
      </div>

      {/* Mensaje de éxito/error */}
      {mensaje && (
        <Alert
          variant={mensaje.type}
          title={mensaje.type === "success" ? "Éxito" : "Error"}
          message={mensaje.text}
          className="mb-4"
        />
      )}

      {/* Formulario */}
      <div className="space-y-4">
        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nombre *</Label>
            <Input
              name="nombre"
              value={formData.nombre || ""}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Apellido *</Label>
            <Input
              name="apellido"
              value={formData.apellido || ""}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Teléfono</Label>
            <Input
              name="telefono"
              value={formData.telefono || ""}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Empresa</Label>
            <Input
              name="nombre_empresa"
              value={formData.nombre_empresa || ""}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={handleClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </Modal>
  );
};

export default ModalEditarConductor;
