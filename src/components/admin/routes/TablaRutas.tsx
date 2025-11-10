import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../../components/ui/table";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import {
  ArrowRight,
  Check,
  AlertTriangle,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { Ruta } from "../../../global/types/rutas";
import { Conductor } from "../../../global/types/conductores";

interface TablaRutasProps {
  rutas: Ruta[];
  estado: string;
  onAbrirModal: (rutaId: number, action: "assign" | "details") => void;
  onEliminarRuta: (rutaId: number) => void;
  onCancelarAsignacion: (rutaId: number) => void;
  onCompletarRuta: (rutaId: number) => void;
  onMarcarFallida: (rutaId: number) => void;
  onEditarRuta?: (rutaId: number) => void;
  onVerMapa?: (ruta: Ruta, conductor: Conductor | null) => void;
}

const TablaRutas: React.FC<TablaRutasProps> = ({
  rutas,
  estado,
  onAbrirModal,
  onEliminarRuta,
  onCancelarAsignacion,
  onCompletarRuta,
  onMarcarFallida,
  onEditarRuta,
  onVerMapa,
}) => {
  if (rutas.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 p-12">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <LocationOffIcon className="text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No hay rutas en estado: {estado}
          </p>
        </div>
      </div>
    );
  }

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-CO");

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              {[
                "Código Manifiesto",
                "Conductor",
                "Vehículo",
                "Paquetes",
                "Fecha inicio",
                "Fecha fin",
                "Acciones",
              ].map((header) => (
                <TableCell
                  key={header}
                  isHeader
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                >
                  {header}
                </TableCell>
              ))}
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
                <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {ruta.cod_manifiesto ?? "Sin código"}
                </TableCell>

                <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {ruta.usuario
                    ? `${ruta.usuario.nombre} ${ruta.usuario.apellido}`
                    : "Sin asignar"}
                </TableCell>

                <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {ruta.vehiculo?.placa ?? "Sin vehículo"}
                </TableCell>

                <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {ruta.paquete?.length ?? 0}
                </TableCell>

                <TableCell className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {formatFecha(ruta.fecha_inicio)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {ruta.fecha_fin ? formatFecha(ruta.fecha_fin) : "En curso"}
                </TableCell>

                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* Ver detalles */}
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

                    {/* Ver mapa */}
                    {/* Ver mapa solo en rutas asignadas */}
                    {ruta.estado_ruta === "Asignada" && onVerMapa && (
                      <button
                        onClick={() => {
                          const conductor: Conductor | null = ruta.usuario
                            ? {
                                id: ruta.usuario.id_usuario, // mapear id_usuario → id
                                nombre: ruta.usuario.nombre,
                                apellido: ruta.usuario.apellido,
                                correo: ruta.usuario.correo,
                              }
                            : null;
                          onVerMapa(ruta, conductor);
                        }}
                        className="p-2 text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg"
                        title="Ver mapa"
                      >
                        📍
                      </button>
                    )}

                    {/* Acciones Pendiente */}
                    {ruta.estado_ruta === "Pendiente" && (
                      <>
                        <button
                          onClick={() => onEditarRuta?.(ruta.id_ruta)}
                          className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
                          title="Editar ruta"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </button>

                        <button
                          onClick={() => onEliminarRuta(ruta.id_ruta)}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                          title="Eliminar ruta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onAbrirModal(ruta.id_ruta, "assign")}
                          className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
                          title="Asignar ruta"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Acciones Asignada */}
                    {ruta.estado_ruta === "Asignada" && (
                      <>
                        <button
                          onClick={() => onCompletarRuta(ruta.id_ruta)}
                          className="p-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg"
                          title="Marcar como completada"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onMarcarFallida(ruta.id_ruta)}
                          className="p-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg"
                          title="Marcar como fallida"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onCancelarAsignacion(ruta.id_ruta)}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                          title="Cancelar asignación"
                        >
                          <X className="w-4 h-4" />
                        </button>
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
