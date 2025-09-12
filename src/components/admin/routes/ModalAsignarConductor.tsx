import React, { useState } from "react";
import Button from "../../ui/button/Button";
import { Conductor, ConductorEstado } from "../../../global/dataMock";

// Componente para modal de asignar conductor
export const ModalAsignarConductor: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (conductorId: string) => void;
  conductores: Conductor[];   // 👈 NUEVO
}> = ({ isOpen, onClose, onConfirm, conductores }) => {  // 👈 destructurado

  const [selectedConductor, setSelectedConductor] = useState<string>("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-99999 animate-in fade-in-0 duration-300">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-[80vw] max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-10 w-10 rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
        >
          {/* ... tu svg */}
        </button>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Asignar Conductor
          </h2>
          <select
            value={selectedConductor}
            onChange={(e) => setSelectedConductor(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Seleccionar conductor</option>
            {conductores   // 👈 ahora viene como prop
              .filter((c) => c.estado === ConductorEstado.Disponible)
              .map((conductor) => (
                <option
                  key={conductor.id_conductor}
                  value={conductor.id_conductor}
                >
                  {conductor.nombre} {conductor.apellido}
                </option>
              ))}
          </select>
          <Button
            variant="primary"
            disabled={!selectedConductor}
            onClick={() => onConfirm(selectedConductor)}
            className="w-full bg-success-500 hover:bg-success-600 text-white"
          >
            Asignar
          </Button>
        </div>
      </div>
    </div>
  );
};
