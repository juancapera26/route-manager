import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";
import { Dialog } from "../../ui/modal/Dialog";
import { Conductor } from "../../../global/types/conductores";

interface ModalEliminarConductorProps {
  isOpen: boolean;
  onClose: () => void;
  conductor?: Conductor | null;
  onConfirm: (id_conductor: number) => void;
  isLoading?: boolean;
  error?: string | null;
}

const ModalDeleteDriver: React.FC<ModalEliminarConductorProps> = ({
  isOpen,
  onClose,
  conductor,
  onConfirm,
  isLoading = false,
  error,
}) => {
  const [mensaje, setMensaje] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (isOpen) setMensaje(null);
  }, [isOpen]);

  const handleConfirm = () => {
    if (!conductor) return;
    onConfirm(conductor.id);
    setMensaje({ text: "Conductor eliminado correctamente", type: "success" });
    setTimeout(() => {
      setMensaje(null);
      onClose();
    }, 1000);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Eliminar Conductor">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-red-500/10 rounded-lg">
          <Trash2 className="w-5 h-5 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Eliminar Conductor
        </h2>
      </div>

      {mensaje && (
        <Alert
          variant={mensaje.type}
          title={mensaje.type === "success" ? "Éxito" : "Error"}
          message={mensaje.text}
          className="mb-3"
        />
      )}

      {error && (
        <Alert variant="error" title="Error" message={error} className="mb-3" />
      )}

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        {conductor ? (
          <>
            ¿Seguro que deseas eliminar al conductor{" "}
            <strong>
              {conductor.nombre} {conductor.apellido}
            </strong>
          </>
        ) : (
          "No hay conductor seleccionado."
        )}
      </p>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Eliminando..." : "Eliminar"}
        </Button>
      </div>
    </Dialog>
  );
};

export default ModalDeleteDriver;
