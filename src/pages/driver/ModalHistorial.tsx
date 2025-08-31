import React from "react";

interface ModalHistorialProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

const ModalHistorial: React.FC<ModalHistorialProps> = ({
  isOpen,
  onClose,
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  if (!isOpen) return null;

  const leftPos = isExpanded || isHovered || isMobileOpen ? 290 : 90;

  return (
    <div
      className="fixed top-16 z-[60] bg-gray-200 dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700
        w-[400px] h-[calc(100vh-4rem)] transition-all animate-slide-in px-6 py-4 overflow-y-auto"
      style={{ left: leftPos }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
          Historial de rutas
        </h2>
        <button
          className="text-2xl font-bold hover:text-red-600 dark:hover:text-red-400"
          onClick={onClose}
          title="Cerrar"
        >
          &times;
        </button>
      </div>
      <div className="flex gap-2 mb-3 items-center px-2 text-gray-900 dark:text-white">
        <span className="font-bold">Historial</span>
        <div className="flex gap-2 items-center ml-4">
          <input
            type="text"
            placeholder="día"
            className="border w-12 px-1 rounded text-center text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
          <input
            type="text"
            placeholder="mes"
            className="border w-12 px-1 rounded text-center text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
          <input
            type="text"
            placeholder="año"
            className="border w-16 px-1 rounded text-center text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>
      <div className="overflow-x-auto max-h-[60vh]">
        <table className="min-w-full border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="font-bold px-2 py-1 text-left text-gray-900 dark:text-white">
                Manifiesto
              </th>
              <th className="font-bold px-2 py-1 text-left text-gray-900 dark:text-white">
                Hora de inicio/final
              </th>
              <th className="font-bold px-2 py-1 text-left text-gray-900 dark:text-white">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }).map((_, i) => (
              <tr
                key={i}
                className="border-b border-gray-600 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td>
                  <a
                    href="#"
                    className="text-blue-700 dark:text-blue-300 underline hover:text-blue-900 dark:hover:text-blue-400"
                  >
                    #15967
                  </a>
                </td>
                <td className="text-gray-900 dark:text-white">
                  1:30 am / 6:30 pm
                </td>
                <td className="text-gray-900 dark:text-white">25/02/2025</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModalHistorial;
