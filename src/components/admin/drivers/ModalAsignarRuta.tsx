import { Ruta } from "../../../global/types";

interface Props {
  routes: Ruta[];
  onAssign: (routeId: string) => void;
  onClose: () => void;
}

export default function AssignRouteModal({ routes, onAssign, onClose }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded shadow-lg w-[600px]">
        <h2 className="text-lg font-bold mb-4">Asignar Ruta</h2>
        <table className="min-w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th>ID</th>
              <th>Zona</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.id_ruta} className="border-b">
                <td>{r.id_ruta}</td>
                <td>{r.zona}</td>
                <td>{r.estado}</td>
                <td>
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded"
                    onClick={() => onAssign(r.id_ruta)}
                  >
                    Asignar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
