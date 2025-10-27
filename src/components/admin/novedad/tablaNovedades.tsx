import React from "react";
import { Image as ImageIcon, FileText } from "lucide-react";
import { ColumnDef } from "../../ui/table/DataTable";
import { Novedad } from "../../../global/types/novedades";

// ===================== PROPS =====================
interface NovedadesTableProps {
  novedades: Novedad[];
  onVerImagen: (url: string) => void;
  onRefetch?: () => void;
}

// ===================== COLUMNAS DE LA TABLA =====================
export const NOVEDADES_COLUMNS: Record<string, ColumnDef<Novedad>> = {
  id_reporte: {
    key: "id_reporte",
    header: "ID",
    accessor: "id_reporte",
    className: "font-mono text-sm",
    sortable: true,
  },
  descripcion: {
    key: "descripcion",
    header: "DESCRIPCIÓN",
    accessor: "descripcion",
    className: "text-sm",
  },
  tipo: {
    key: "tipo",
    header: "TIPO",
    accessor: "tipo",
    className: "capitalize text-sm",
  },
  fecha_reporte: {
    key: "fecha_reporte",
    header: "FECHA",
    accessor: (item) =>
      new Date(item.fecha_reporte).toLocaleDateString("es-ES"),
    sortable: true,
  },
};

// ===================== COMPONENTE DE TABLA =====================
const NovedadesTable: React.FC<NovedadesTableProps> = ({
  novedades,
  onVerImagen,
}) => {
  return (
    <div className="bg-[#141C2F] rounded-xl p-4 shadow-md border border-[#1F2A44]">
      <h2 className="text-lg font-semibold text-white mb-4">
        Gestión de Novedades
      </h2>

      <table className="min-w-full border-collapse text-sm text-gray-200">
        <thead className="bg-[#1F2A44] text-gray-300">
          <tr>
            {Object.values(NOVEDADES_COLUMNS).map((col) => (
              <th
                key={col.key}
                className="p-3 text-left font-semibold text-xs tracking-wide"
              >
                {col.header}
              </th>
            ))}
            <th className="p-3 text-left font-semibold text-xs tracking-wide">
              IMAGEN
            </th>
          </tr>
        </thead>

        <tbody>
          {novedades.length === 0 ? (
            <tr>
              <td
                colSpan={Object.keys(NOVEDADES_COLUMNS).length + 1}
                className="text-center py-10 text-gray-500 italic"
              >
                <div className="flex flex-col items-center justify-center">
                  <FileText className="w-6 h-6 mb-2 text-gray-600" />
                  No hay novedades registradas
                </div>
              </td>
            </tr>
          ) : (
            novedades.map((item) => (
              <tr
                key={item.id_reporte}
                className="border-b border-[#1F2A44] hover:bg-[#1A2238] transition-colors"
              >
                {Object.values(NOVEDADES_COLUMNS).map((col) => (
                  <td key={col.key} className="p-3 text-sm">
                    {typeof col.accessor === "function"
                      ? col.accessor(item)
                      : (item as any)[col.accessor]}
                  </td>
                ))}

                <td className="p-3 text-sm text-center">
                  {item.imagen ? (
                    <button
                      onClick={() => onVerImagen(item.imagen!)}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Ver
                    </button>
                  ) : (
                    <span className="text-gray-500 italic">Sin imagen</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NovedadesTable;
