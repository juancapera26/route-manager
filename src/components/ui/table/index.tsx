// src/components/ui/table/index.tsx
import * as React from "react";

// Props para cada tipo de elemento HTML de tabla
interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}
interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  isHeader?: boolean;
}

// Tabla principal
export const Table = ({ children, className = "", ...rest }: TableProps) => {
  return (
    <table className={`min-w-full ${className}`} {...rest}>
      {children}
    </table>
  );
};

// Encabezado de la tabla
export const TableHeader = ({
  children,
  className = "",
  ...rest
}: TableSectionProps) => {
  return (
    <thead className={className} {...rest}>
      {children}
    </thead>
  );
};

// Cuerpo de la tabla
export const TableBody = ({
  children,
  className = "",
  ...rest
}: TableSectionProps) => {
  return (
    <tbody className={className} {...rest}>
      {children}
    </tbody>
  );
};

// Fila de la tabla
export const TableRow = ({
  children,
  className = "",
  ...rest
}: TableRowProps) => {
  return (
    <tr className={className} {...rest}>
      {children}
    </tr>
  );
};

// Celda de la tabla (th o td)
export const TableCell = ({
  children,
  isHeader = false,
  className = "",
  ...rest
}: TableCellProps) => {
  const Tag = isHeader ? "th" : "td";
  return (
    // Type assertion para Tag dinámico
    <Tag className={className} {...(rest as any)}>
      {children}
    </Tag>
  );
};

export default { Table, TableHeader, TableBody, TableRow, TableCell };