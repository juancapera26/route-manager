// src/components/ui/table/DataTable.tsx
import React from "react";
import Badge from "../badge/Badge";

// ===================== TIPOS BASE =====================
export interface BaseEntity {
  [key: string]: any;
}

export interface ColumnDef<T extends BaseEntity> {
  key: string;
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
}

export interface ActionButton<T extends BaseEntity> {
  key: string;
  label: string;
  tooltip?: string;
  icon?: React.ReactNode;
  variant?: "default" | "outline" | "destructive" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: (item: T) => boolean;
  visible?: (item: T) => boolean;
  onClick: (item: T) => void;
}

export interface DataTableProps<T extends BaseEntity> {
  data: T[];
  columns: ColumnDef<T>[];
  actions?: ActionButton<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  keyField?: keyof T;
}

// ===================== COMPONENTES DE SOPORTE =====================
const TableSkeleton: React.FC<{ columns: number; rows?: number }> = ({
  columns,
  rows = 5,
}) => (
  <>
    {Array.from({ length: rows }).map((_, index) => (
      <tr
        key={index}
        className="border-b border-gray-200 dark:border-gray-700 animate-pulse"
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <td key={colIndex} className="px-6 py-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </td>
        ))}
      </tr>
    ))}
  </>
);

const EmptyState: React.FC<{ message: string; columns: number }> = ({
  message,
  columns,
}) => (
  <tr>
    <td
      colSpan={columns}
      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
    >
      <div className="flex flex-col items-center gap-2">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-sm">{message}</span>
      </div>
    </td>
  </tr>
);

// ===================== COMPONENTE PRINCIPAL =====================
export const DataTable = <T extends BaseEntity>({
  data,
  columns,
  actions = [],
  loading = false,
  emptyMessage = "No se encontraron registros",
  className = "",
  onRowClick,
  keyField,
}: DataTableProps<T>) => {
  // ===================== HELPERS =====================
  const getRowKey = (item: T, index: number): string => {
    if (keyField && item[keyField] !== undefined) {
      return String(item[keyField]);
    }
    return `row-${index}`;
  };

  const getCellContent = (item: T, column: ColumnDef<T>): React.ReactNode => {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }

    const value = item[column.accessor];

    // Formateo automático para fechas ISO
    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {
      return new Date(value).toLocaleDateString("es-ES");
    }

    // Manejar arrays
    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : "Sin asignar";
    }

    // Manejar objetos anidados
    if (typeof value === "object" && value !== null) {
      return "[Objeto]";
    }

    return value ?? "N/A";
  };

  const getVisibleActions = (item: T): ActionButton<T>[] => {
    return actions.filter((action) =>
      action.visible ? action.visible(item) : true
    );
  };

  const isActionDisabled = (action: ActionButton<T>, item: T): boolean => {
    return action.disabled ? action.disabled(item) : false;
  };

  const getButtonClasses = (
    action: ActionButton<T>,
    isDisabled: boolean
  ): string => {
    // Clases base similares a los iconos de referencia
    const baseClasses = "p-2 rounded-lg transition-colors";

    if (isDisabled) {
      return `${baseClasses} text-gray-300 cursor-not-allowed dark:text-gray-600`;
    }

    // Mapear variantes a colores específicos como en los iconos de referencia
    const variantClasses = {
      default:
        "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10", // Para primary actions
      outline:
        "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700", // Para outline actions
      destructive:
        "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10", // Para delete
      secondary:
        "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10", // Para edit
    };

    return [
      baseClasses,
      variantClasses[action.variant || "default"],
      action.className || "",
    ].join(" ");
  };

  // ===================== RENDER =====================
  const totalColumns = columns.length + (actions.length > 0 ? 1 : 0);

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* HEADER */}
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50 ${
                    column.className || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50">
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {loading ? (
              <TableSkeleton columns={totalColumns} />
            ) : data.length === 0 ? (
              <EmptyState message={emptyMessage} columns={totalColumns} />
            ) : (
              data.map((item, index) => {
                const visibleActions = getVisibleActions(item);

                return (
                  <tr
                    key={getRowKey(item, index)}
                    onClick={() => onRowClick?.(item)}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50/30 dark:bg-gray-800/50"
                    } ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {/* CELDAS DE DATOS */}
                    {columns.map((column) => (
                      <td
                        key={`${getRowKey(item, index)}-${column.key}`}
                        className={`px-6 py-4 ${column.className || ""}`}
                      >
                        <div className="text-sm text-gray-900 dark:text-white">
                          {getCellContent(item, column)}
                        </div>
                      </td>
                    ))}

                    {/* CELDA DE ACCIONES */}
                    {actions.length > 0 && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          {visibleActions.map((action) => {
                            const disabled = isActionDisabled(action, item);

                            return (
                              <button
                                key={`${getRowKey(item, index)}-${action.key}`}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevenir trigger de onRowClick
                                  if (!disabled) {
                                    action.onClick(item);
                                  }
                                }}
                                disabled={disabled}
                                className={getButtonClasses(action, disabled)}
                                title={action.tooltip || action.label}
                              >
                                {/* Icono con tamaño fijo w-4 h-4 como en los iconos de referencia */}
                                <span className="w-4 h-4 flex items-center justify-center">
                                  {action.icon}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
