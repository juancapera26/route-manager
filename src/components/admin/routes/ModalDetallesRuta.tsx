import React from "react";
import { Ruta, RutaEstado, Conductor } from "../../../global/dataMock";
import Badge from "../../ui/badge/Badge";

export const ModalDetallesRuta: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ruta: Ruta | null;            // 👈 antes "detallesRuta"
  conductores: Conductor[];     // 👈 lo recibe como prop
}> = ({ isOpen, onClose, ruta, conductores }) => {
  if (!isOpen || !ruta) return null;

  const getConductorNombre = (id: string | null) => {
    if (!id) return "Sin asignar";
    const conductor = conductores.find((c) => c.id_conductor === id);
    return conductor ? `${conductor.nombre} ${conductor.apellido}` : "Desconocido";
  };

  const getColorEstado = (estado: RutaEstado) => {
    switch (estado) {
      case RutaEstado.Pendiente:
        return "warning";
      case RutaEstado.asignada:
        return "info";
      case RutaEstado.Completada:
        return "success";
      case RutaEstado.Fallida:
        return "error";
      default:
        return "light";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-99999 animate-in fade-in-0 duration-300">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-[80vw] max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-10 w-10 rounded-full bg-gray-100/80 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Detalles de la Ruta {ruta.id_ruta}
        </h2>

        <p><strong>Zona:</strong> {ruta.zona}</p>
        <p>
          <strong>Horario:</strong>{" "}
          {new Date(ruta.horario.inicio).toLocaleTimeString()} -{" "}
          {new Date(ruta.horario.fin).toLocaleTimeString()}
        </p>
        <p>
          <strong>Fecha Registro:</strong>{" "}
          {new Date(ruta.fecha_registro).toLocaleDateString()}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          <Badge variant="light" color={getColorEstado(ruta.estado)}>
            {ruta.estado}
          </Badge>
        </p>
        <p><strong>Conductor:</strong> {getConductorNombre(ruta.id_conductor_asignado)}</p>
        <p><strong>Puntos de Entrega:</strong> {ruta.puntos_entrega}</p>

        <h3 className="text-lg font-semibold mt-4">Paquetes Asignados</h3>
        {ruta.paquetes_asignados.length === 0 ? (
          <p>No hay paquetes asignados.</p>
        ) : (
          ruta.paquetes_asignados.map((paqueteId) => (
            <div
              key={paqueteId}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md my-1"
            >
              <p><strong>ID Paquete:</strong> {paqueteId}</p>
              <p className="text-gray-500 text-sm">
                Información del paquete no disponible en este contexto.
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
