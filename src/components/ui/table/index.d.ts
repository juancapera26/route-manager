import { ReactNode } from "react";
interface TableProps {
    children: ReactNode;
    className?: string;
}
interface TableHeaderProps {
    children: ReactNode;
    className?: string;
}
interface TableBodyProps {
    children: ReactNode;
    className?: string;
}
interface TableRowProps {
    children: ReactNode;
    className?: string;
}
interface TableCellProps {
    children: ReactNode;
    isHeader?: boolean;
    className?: string;
}
declare const Table: React.FC<TableProps>;
declare const TableHeader: React.FC<TableHeaderProps>;
declare const TableBody: React.FC<TableBodyProps>;
declare const TableRow: React.FC<TableRowProps>;
declare const TableCell: React.FC<TableCellProps>;
export { Table, TableHeader, TableBody, TableRow, TableCell };
