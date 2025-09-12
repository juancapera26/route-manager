import React from "react";
import { Ruta, RutaEstado, Conductor } from "../../../global/dataMock"; // Ajusta la ruta relativa según tu estructura
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../../components/ui/table"; // Ajusta la ruta
import Button from "../../../components/ui/button/Button"; // Ajusta la ruta
import LocationOffIcon from '@mui/icons-material/LocationOff';

interface TablaRutasProps {
  rutas: Ruta[];
  estado: RutaEstado;
  conductores: Conductor[]; // Agrego esto como prop para que sea reutilizable y no dependa de estado global
  onAbrirModal: (rutaId: string, action: "assign" | "details") => void;
  onEliminarRuta: (rutaId: string) => void;
  onCancelarAsignacion: (rutaId: string) => void;
  onCompletarRuta: (rutaId: string) => void;
  onMarcarFallida: (rutaId: string) => void;
  onEditarRuta?: (rutaId: string) => void; // Opcional, para futura implementación
}

const TablaRutas: React.FC<TablaRutasProps> = ({
  rutas,
  estado,
  conductores,
  onAbrirModal,
  onEliminarRuta,
  onCancelarAsignacion,
  onCompletarRuta,
  onMarcarFallida,
  onEditarRuta,
}) => {
  if (rutas.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 p-12">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <LocationOffIcon className="text-gray-500 dark:text-gray-400"></LocationOffIcon>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No hay rutas en estado: {estado}
          </p>
        </div>
      </div>
    );
  }

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

  const getConductorNombre = (id: string | null) => {
    if (!id) return "Sin asignar";
    const conductor = conductores.find((c) => c.id_conductor === id);
    return conductor
      ? `${conductor.nombre} ${conductor.apellido}`
      : "Desconocido";
  };

  const formatHorario = (horario: { inicio: string; fin: string }) => {
    const inicioTime = new Date(horario.inicio).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const finTime = new Date(horario.fin).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${inicioTime} - ${finTime}`;
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                ID Ruta
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                Conductor
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                Paquetes
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                Zona
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                Horario
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                Registro
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rutas.map((ruta, index) => (
              <TableRow
                key={ruta.id_ruta}
                className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50/30 dark:bg-gray-800/50"
                }`}
              >
                <TableCell className="px-6 py-4">
                  <span className="flex items-center">{ruta.id_ruta}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getConductorNombre(ruta.id_conductor_asignado)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm text-gray-900 dark:text-gray-300">
                    {ruta.paquetes_asignados.length}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm text-gray-900 dark:text-gray-300">
                    {ruta.zona}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm text-gray-900 dark:text-gray-300">
                    {formatHorario(ruta.horario)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {formatFecha(ruta.fecha_registro)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botón Ver detalles - siempre presente */}
                    <button
                      onClick={() => onAbrirModal(ruta.id_ruta, "details")}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>

                    {ruta.estado === RutaEstado.Pendiente && (
                      <>
                        {/* Editar */}
                        <button
                          onClick={() =>
                            onEditarRuta ? onEditarRuta(ruta.id_ruta) : alert("Recordatorio: Debo cambiar esta alerta por un modal mas adelante")
                          }
                          className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Editar ruta"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        {/* Eliminar */}
                        <button
                          onClick={() => onEliminarRuta(ruta.id_ruta)}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar ruta"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>

                        {/* Asignar un conductor */}
                        <Button
                          size="sm"
                          onClick={() => onAbrirModal(ruta.id_ruta, "assign")}
                        >
                          Asignar Conductor
                        </Button>
                      </>
                    )}

                    {ruta.estado === RutaEstado.asignada && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-500/10"
                          onClick={() => onCompletarRuta(ruta.id_ruta)}
                        >
                          Completar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-500/10"
                          onClick={() => onMarcarFallida(ruta.id_ruta)}
                        >
                          Fallar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-500/10"
                          onClick={() => onCancelarAsignacion(ruta.id_ruta)}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TablaRutas;