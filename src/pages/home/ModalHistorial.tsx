import React from 'react';

interface ModalHistorialProps {
  open: boolean;
  onClose: () => void;
}

const ModalHistorial: React.FC<ModalHistorialProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg max-w-lg w-full max-h-[80vh] overflow-auto">
        <button 
          onClick={onClose} 
          className="mb-4 text-sm font-bold hover:text-red-500"
          aria-label="Cerrar Modal"
        >
          &larr; Cerrar
        </button>

        <h2 className="text-lg font-bold mb-4">Historial de rutas</h2>

        {/* Aquí puedes poner filtros por día, mes, año */}
        {/* Ejemplo simple */}
        <div className="mb-4 flex gap-2">
          <select>
            <option>Día</option>
            {/* Opciones */}
          </select>
          <select>
            <option>Mes</option>
            {/* Opciones */}
          </select>
          <select>
            <option>Año</option>
            {/* Opciones */}
          </select>
        </div>

        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <th className="py-2">Manifiesto</th>
              <th className="py-2">Hora de inicio/final</th>
              <th className="py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {/* Ejemplo de filas - reemplaza con datos reales */}
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <td className="py-2 text-primary cursor-pointer hover:underline">#15967</td>
              <td className="py-2">1:30 am / 6:30 pm</td>
              <td className="py-2">25/02/2025</td>
            </tr>
            {/* ... más filas ... */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModalHistorial;
