//src/components/admin/drivers/ModalDetallesConductor.tsx
import { Conductor } from "../../../global/types";

interface Props {
  driver: Conductor | null;
  onClose: () => void;
}

export default function DriverDetailsModal({ driver, onClose }: Props) {
  if (!driver) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          {driver.nombre} {driver.apellido}
        </h2>
        <p>Estado: {driver.estado}</p>
        <p>Empresa: {driver.nombre_empresa}</p>
        <p>Vehículo asignado: {driver.id_vehiculo_asignado ?? "—"}</p>
        <p>Horario: {driver.horario?.inicio} - {driver.horario?.fin}</p>

        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
