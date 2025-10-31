import React, { useState } from "react";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import TextArea from "../../form/input/TextArea";
import Alert from "../../ui/alert/Alert";
import { RutaFormData } from "../../../global/types/rutas";
import { Add } from "@mui/icons-material";

interface ModalAgregarRutaProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: RutaFormData) => void;
  isLoading?: boolean;
}

interface ErroresFormulario {
  puntos_entrega?: string;
}

export const ModalAgregarRuta: React.FC<ModalAgregarRutaProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<RutaFormData>({
    puntos_entrega: "",
  });

  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [mensaje, setMensaje] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // ===================== VALIDACIONES =====================

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresFormulario = {};

    // Validar puntos de entrega
    if (!formData.puntos_entrega.trim()) {
      nuevosErrores.puntos_entrega = "Los puntos de entrega son requeridos";
    } else if (formData.puntos_entrega.trim().length < 10) {
      nuevosErrores.puntos_entrega = "Describe al menos 10 caracteres";
    } else if (formData.puntos_entrega.trim().length > 500) {
      nuevosErrores.puntos_entrega = "Máximo 500 caracteres";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ===================== MANEJADORES =====================

  const manejarCambioTextArea = (valor: string) => {
    if (errores.puntos_entrega) {
      setErrores((prev) => ({ ...prev, puntos_entrega: undefined }));
    }
    setFormData((prev) => ({ ...prev, puntos_entrega: valor }));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      setMensaje({
        text: "Por favor corrige los errores en el formulario",
        type: "error",
      });
      return;
    }

    try {
      await onSuccess(formData);
      setMensaje({ text: "Ruta creada exitosamente", type: "success" });

      // Reiniciar formulario
      setFormData({
        puntos_entrega: "",
      });
      setErrores({});

      setTimeout(() => {
        setMensaje(null);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error al crear ruta:", error);
      setMensaje({ text: "Error al crear ruta", type: "error" });
    }
  };

  const manejarCerrar = () => {
    if (!isLoading) {
      setMensaje(null);
      setErrores({});
      onClose();
    }
  };

  // ===================== RENDER =====================

  return (
    <Modal isOpen={isOpen} onClose={manejarCerrar}>
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Add className="text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Agregar nueva ruta
          </h3>
        </div>

        {mensaje && (
          <Alert
            variant={mensaje.type}
            title={mensaje.type === "success" ? "Éxito" : "Error"}
            message={mensaje.text}
            className="mb-4"
          />
        )}

        <form onSubmit={manejarEnvio} className="space-y-6">
          {/* Información de la ruta */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Información de la ruta
            </h4>

            <div className="space-y-4">
              <div>
                <Label>Puntos de entrega *</Label>
                <TextArea
                  value={formData.puntos_entrega}
                  onChange={manejarCambioTextArea}
                  placeholder="Describe los puntos de entrega de la ruta (direcciones, referencias, etc.)"
                  rows={4}
                  className={errores.puntos_entrega ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center mt-1">
                  {errores.puntos_entrega && (
                    <p className="text-red-500 text-xs">
                      {errores.puntos_entrega}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs ml-auto">
                    {formData.puntos_entrega.length}/500
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={manejarCerrar}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-w-[120px]"
            >
              {isLoading ? "Creando..." : "Crear ruta"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
