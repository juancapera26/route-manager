// components/novelty/NoveltyTable.tsx
import React from "react";
import { Eye, Trash2, Image as ImageIcon, FileText } from "lucide-react";
import { ColumnDef } from "../../ui/table/DataTable";
import { Novelty } from "../../../global/types/novedades";

interface NoveltyTableProps {
  novelties: Novelty[];
  onViewDetails: (novelty: Novelty) => void;
  onViewImage: (novelty: Novelty) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export const NOVELTY_COLUMNS: Record<string, ColumnDef<Novelty>> = {
  id_novedad: {
    key: "id_novedad",
    header: "ID",
    accessor: "id_novedad",
    className: "font-mono text-sm",
    sortable: true,
  },
  tipo: {
    key: "tipo",
    header: "TIPO",
    accessor: (item) => {
      const colorMap: Record<string, string> = {
        INCIDENTE: "bg-red-500/20 text-red-400 border border-red-500/30",
        RETRASO: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        DAÑO: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
        OTRO: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
        Operativa: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        Logística: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
      };
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorMap[item.tipo] || colorMap.OTRO}`}>
          {item.tipo}
        </span>
      );
    },
    className: "text-sm",
  },
  descripcion: {
    key: "descripcion",
    header: "DESCRIPCIÓN",
    accessor: (item) => (
      <div className="max-w-md truncate" title={item.descripcion}>
        {item.descripcion}
      </div>
    ),
    className: "text-sm",
  },
  fecha: {
    key: "fecha",
    header: "FECHA",
    accessor: (item) => {
      const date = new Date(item.fecha);
      return (
        <div className="flex flex-col">
          <span className="text-sm">{date.toLocaleDateString("es-ES")}</span>
          <span className="text-xs text-gray-500">
            {date.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
    sortable: true,
  },
  usuario: {
    key: "usuario",
    header: "REPORTADO POR",
    accessor: (item) => {
      if (item.usuario) {
        const nombreCompleto = `${item.usuario.nombre} ${item.usuario.apellido}`.trim();
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {nombreCompleto || 'Sin nombre'}
            </span>
            {item.usuario.correo && (
              <span className="text-xs text-gray-500">{item.usuario.correo}</span>
            )}
          </div>
        );
      }
      return <span className="text-gray-500">Usuario #{item.id_usuario}</span>;
    },
    className: "text-sm",
  },
};

const NoveltyTable: React.FC<NoveltyTableProps> = ({
  novelties,
  onViewDetails,
  onViewImage,
  onDelete,
  isLoading = false,
}) => {
  const handleDeleteClick = (id: number, descripcion: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar la novedad #${id}?\n\n"${descripcion}"\n\nEsta acción no se puede deshacer.`
    );
    
    if (confirmed) {
      onDelete(id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#1A2332] rounded-xl p-8 shadow-lg border border-[#2A3441]">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A2332] rounded-xl shadow-lg border border-[#2A3441] overflow-hidden">
      {/* Header de la tabla */}
      <div className="p-4 border-b border-[#2A3441]">
        <h2 className="text-lg font-semibold text-white">
          Gestión de Novedades
        </h2>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#0F1623] border-b border-[#2A3441]">
              {Object.values(NOVELTY_COLUMNS).map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                IMAGEN
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                ACCIONES
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#2A3441]">
            {novelties.length === 0 ? (
              <tr>
                <td
                  colSpan={Object.keys(NOVELTY_COLUMNS).length + 2}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FileText className="w-12 h-12 mb-3 text-gray-600" />
                    <p className="text-lg">No hay novedades registradas</p>
                  </div>
                </td>
              </tr>
            ) : (
              novelties.map((item) => (
                <tr
                  key={item.id_novedad}
                  className="hover:bg-[#0F1623] transition-colors text-gray-300"
                >
                  {Object.values(NOVELTY_COLUMNS).map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm">
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item as any)[col.accessor]}
                    </td>
                  ))}

                  {/* Columna de Imagen */}
                  <td className="px-6 py-4 text-sm">
                    {item.imagen ? (
                      <button
                        onClick={() => onViewImage(item)}
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                        title="Ver imagen"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-xs">Ver</span>
                      </button>
                    ) : (
                      <span className="text-gray-600 text-xs italic">Sin imagen</span>
                    )}
                  </td>

                  {/* Columna de Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDeleteClick(item.id_novedad, item.descripcion)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NoveltyTable;