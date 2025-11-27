// components/novelty/NoveltyTable.tsx
import React from "react";
import { Image as ImageIcon, FileText } from "lucide-react";
import { ColumnDef } from "../../ui/table/DataTable";
import { Novelty } from "../../../global/types/novedades";

interface NoveltyTableProps {
  novelties: Novelty[];
  onViewDetails: (novelty: Novelty) => void;
  onViewImage: (novelty: Novelty) => void;
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
      // Normalizar el tipo (convertir Log_stica a Logística)
      const tipoNormalizado = item.tipo === "Log_stica" ? "Logística" : item.tipo;
      
      const colorMap: Record<string, string> = {
        Operativa:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700",
        Logística:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300 dark:border-purple-700",
      };
      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            colorMap[tipoNormalizado] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          {tipoNormalizado}
        </span>
      );
    },
    className: "text-sm",
  },
  descripcion: {
    key: "descripcion",
    header: "DESCRIPCIÓN",
    accessor: (item) => (
      <div className="max-w-md truncate text-foreground" title={item.descripcion}>
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
          <span className="text-sm text-foreground">
            {date.toLocaleDateString("es-ES")}
          </span>
          <span className="text-xs text-muted-foreground">
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
            <span className="font-medium text-sm text-foreground">
              {nombreCompleto || "Sin nombre"}
            </span>
            {item.usuario.correo && (
              <span className="text-xs text-muted-foreground">
                {item.usuario.correo}
              </span>
            )}
          </div>
        );
      }
      return (
        <span className="text-muted-foreground">Usuario #{item.id_usuario}</span>
      );
    },
    className: "text-sm",
  },
};

const NoveltyTable: React.FC<NoveltyTableProps> = ({
  novelties,
  onViewDetails,
  onViewImage,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-8 shadow-lg border border-border transition-colors">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden transition-colors duration-300">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Gestión de Novedades
        </h2>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted border-b border-border">
              {Object.values(NOVELTY_COLUMNS).map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                IMAGEN
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {novelties.length === 0 ? (
              <tr>
                <td
                  colSpan={Object.keys(NOVELTY_COLUMNS).length + 1}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <FileText className="w-12 h-12 mb-3 opacity-60" />
                    <p className="text-lg">No hay novedades registradas</p>
                  </div>
                </td>
              </tr>
            ) : (
              novelties.map((item) => (
                <tr
                  key={item.id_novedad}
                  className="hover:bg-muted/50 transition-colors text-foreground"
                >
                  {Object.values(NOVELTY_COLUMNS).map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm">
                      {typeof col.accessor === "function"
                        ? col.accessor(item)
                        : (item as any)[col.accessor]}
                    </td>
                  ))}

                  {/* Imagen */}
                  <td className="px-6 py-4 text-sm">
                    {item.imagen ? (
                      <button
                        onClick={() => onViewImage(item)}
                        className="text-primary hover:text-primary/80 flex items-center gap-2 transition-colors"
                        title="Ver imagen"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-xs">Ver</span>
                      </button>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">
                        Sin imagen
                      </span>
                    )}
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