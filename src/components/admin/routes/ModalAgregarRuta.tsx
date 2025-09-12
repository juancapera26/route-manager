import React, { useState } from "react";
import Button from "../../ui/button/Button";
import { ZonaRuta } from "../../../global/dataMock";
import { RutaFormData } from "../../../global/types/rutas";


// Componente para modal de agregar ruta
export const ModalAgregarRuta: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: RutaFormData) => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, onSuccess, isLoading }) => {
  const [formData, setFormData] = useState<RutaFormData>({
    zona: ZonaRuta.Norte,
    horario: { inicio: "", fin: "" },
    puntos_entrega: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
  };

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
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Agregar Nueva Ruta
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Zona
            </label>
            <select
              value={formData.zona}
              onChange={(e) =>
                setFormData({ ...formData, zona: e.target.value as ZonaRuta })
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {Object.values(ZonaRuta).map((zona) => (
                <option key={zona} value={zona}>
                  {zona}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Horario Inicio
            </label>
            <input
              type="datetime-local"
              value={formData.horario.inicio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  horario: { ...formData.horario, inicio: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Horario Fin
            </label>
            <input
              type="datetime-local"
              value={formData.horario.fin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  horario: { ...formData.horario, fin: e.target.value },
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Puntos de Entrega
            </label>
            <textarea
              value={formData.puntos_entrega}
              onChange={(e) =>
                setFormData({ ...formData, puntos_entrega: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={4}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full bg-success-500 hover:bg-success-600 text-white"
          >
            {isLoading ? "Creando..." : "Crear Ruta"}
          </Button>
        </form>
      </div>
    </div>
  );
};
