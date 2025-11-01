// src/global/types/tableTypes.ts
import React from "react";
import { Paquete, PaquetesEstados } from "../../../global/types/paquete.types";
import { ColumnDef, ActionButton } from "../../ui/table/DataTable";
import Badge, { BadgeColor } from "../../ui/badge/Badge";
import {
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  X,
  RotateCcw,
  Check,
  MapPin,
  AlertTriangle,
} from "lucide-react";

//tabla de paquetes

// ===================== TIPOS DE COLUMNAS =====================
export type PaquetesColumnKey =
  | "id_paquete"
  | "conductor_nombre"
  | "ruta_asignada"
  | "destinatario"
  | "fecha_registro"
  | "fecha_entrega"
  | "estado";

// ===================== TIPOS DE ACCIONES =====================
export type PaquetesActionKey =
  | "view"
  | "edit"
  | "delete"
  | "assign"
  | "cancel_assignment"
  | "reassign"
  | "mark_entregado"
  | "mark_fallido"
  | "track";

// ===================== DEFINICIÓN DE COLUMNAS =====================
export const PAQUETES_COLUMNS: Record<PaquetesColumnKey, ColumnDef<Paquete>> = {
  id_paquete: {
    key: "id_paquete",
    header: "ID Paquete",
    accessor: "id_paquete",
    className: "font-mono text-sm",
    sortable: true,
  },

  conductor_nombre: {
    key: "conductor_nombre",
    header: "Conductor",
    accessor: (item) => {
      // Si tiene ruta y la ruta tiene conductor
      if (item.ruta?.conductor) {
        return (
          <span className="text-sm">
            {item.ruta.conductor.nombre} {item.ruta.conductor.apellido}
          </span>
        );
      }
      // Si tiene ruta pero sin conductor
      if (item.id_ruta) {
        return (
          <span className="text-gray-500 text-xs italic">
            Ruta sin conductor
          </span>
        );
      }
      // Sin ruta asignada
      return <span className="text-gray-400 italic">Sin asignar</span>;
    },
    sortable: false,
  },

  ruta_asignada: {
    key: "ruta_asignada",
    header: "Ruta",
    accessor: (item) => {
      if (!item.id_ruta) {
        return <span className="text-gray-400 italic">Sin asignar</span>;
      }
      
      // Si incluye la relación ruta
      if (item.ruta) {
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {item.ruta.nombre || `Ruta #${item.id_ruta}`}
            </span>
            {item.ruta.descripcion && (
              <span className="text-xs text-gray-500">
                {item.ruta.descripcion}
              </span>
            )}
          </div>
        );
      }
      
      return <span className="text-sm font-mono">Ruta #{item.id_ruta}</span>;
    },
    className: "text-sm",
  },

  destinatario: {
    key: "destinatario",
    header: "Destinatario",
    accessor: (item) => {
      if (item.cliente) {
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {item.cliente.nombre} {item.cliente.apellido}
            </span>
            {item.cliente.telefono_movil && (
              <span className="text-xs text-gray-500">
                {item.cliente.telefono_movil}
              </span>
            )}
          </div>
        );
      }
      return <span className="text-gray-400 italic">Desconocido</span>;
    },
    sortable: true,
  },

  fecha_registro: {
    key: "fecha_registro",
    header: "Registro",
    accessor: (item) => {
      const date = new Date(item.fecha_registro);
      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {date.toLocaleDateString("es-ES")}
          </span>
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

  fecha_entrega: {
    key: "fecha_entrega",
    header: "Entrega",
    accessor: (item) => {
      if (item.fecha_entrega) {
        const date = new Date(item.fecha_entrega);
        return (
          <div className="flex flex-col">
            <span className="text-sm">
              {date.toLocaleDateString("es-ES")}
            </span>
            <span className="text-xs text-gray-500">
              {date.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        );
      }
      return <span className="text-gray-400 italic">Pendiente</span>;
    },
    sortable: true,
  },

  estado: {
    key: "estado",
    header: "Estado",
    accessor: (item) => {
      const colorMap: Record<PaquetesEstados, BadgeColor> = {
        [PaquetesEstados.Pendiente]: "warning",
        [PaquetesEstados.Asignado]: "info",
        [PaquetesEstados.Entregado]: "success",
        [PaquetesEstados.Fallido]: "error",
      };

      return (
        <Badge
          variant="light"
          color={colorMap[item.estado] || "light"}
          size="sm"
        >
          {item.estado}
        </Badge>
      );
    },
    sortable: true,
  },
};

// ===================== COLUMNAS POR ESTADO =====================
export const COLUMNS_BY_ESTADO: Record<PaquetesEstados, PaquetesColumnKey[]> = {
  [PaquetesEstados.Pendiente]: [
    "id_paquete",
    "destinatario",
    "fecha_registro",
    "estado",
  ],
  [PaquetesEstados.Asignado]: [
    "id_paquete",
    "ruta_asignada",
    "conductor_nombre",
    "destinatario",
    "fecha_registro",
    "estado",
  ],
  [PaquetesEstados.Entregado]: [
    "id_paquete",
    "ruta_asignada",
    "conductor_nombre",
    "destinatario",
    "fecha_registro",
    "fecha_entrega",
    "estado",
  ],
  [PaquetesEstados.Fallido]: [
    "id_paquete",
    "destinatario",
    "fecha_registro",
    "estado",
  ],
};

// ===================== ACCIONES POR ESTADO =====================
export const ACTIONS_BY_ESTADO: Record<PaquetesEstados, PaquetesActionKey[]> = {
  [PaquetesEstados.Pendiente]: ["view", "edit", "delete", "assign"],
  [PaquetesEstados.Asignado]: ["view", "cancel_assignment", "mark_fallido"],
  [PaquetesEstados.Entregado]: ["view", "track"],
  [PaquetesEstados.Fallido]: ["view", "edit", "delete", "reassign"],
};

// ===================== DEFINICIÓN DE ACCIONES BASE =====================
export const createPaqueteAction = (
  key: PaquetesActionKey,
  callbacks: PaquetesActionCallbacks
): ActionButton<Paquete> => {
  const actions: Record<PaquetesActionKey, ActionButton<Paquete>> = {
    view: {
      key: "view",
      label: "",
      tooltip: "Ver detalles del paquete",
      icon: <Eye className="w-4 h-4" />,
      variant: "outline",
      onClick: callbacks.onView,
    },

    edit: {
      key: "edit",
      label: "",
      tooltip: "Editar paquete",
      icon: <Edit className="w-4 h-4" />,
      variant: "secondary",
      onClick: callbacks.onEdit,
      visible: (item) =>
        [PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(item.estado),
    },

    delete: {
      key: "delete",
      label: "",
      tooltip: "Eliminar paquete",
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
      onClick: callbacks.onDelete,
      visible: (item) =>
        [PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(item.estado),
    },

    assign: {
      key: "assign",
      label: "",
      tooltip: "Asignar a ruta",
      icon: <ArrowRight className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onAssign,
      visible: (item) => item.estado === PaquetesEstados.Pendiente,
    },

    cancel_assignment: {
      key: "cancel_assignment",
      label: "",
      tooltip: "Cancelar asignación",
      icon: <X className="w-4 h-4" />,
      variant: "destructive",
      onClick: callbacks.onCancelAssignment,
      visible: (item) => item.estado === PaquetesEstados.Asignado,
    },

    reassign: {
      key: "reassign",
      label: "",
      tooltip: "Reasignar a otra ruta",
      icon: <RotateCcw className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onReassign,
      visible: (item) => item.estado === PaquetesEstados.Fallido,
    },

    mark_entregado: {
      key: "mark_entregado",
      label: "",
      tooltip: "Marcar como entregado",
      icon: <Check className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onMarkEntregado,
      visible: (item) => item.estado === PaquetesEstados.Asignado,
    },

    mark_fallido: {
      key: "mark_fallido",
      label: "",
      tooltip: "Marcar como fallido",
      icon: <AlertTriangle className="w-4 h-4" />,
      variant: "outline",
      onClick: callbacks.onMarkFallido,
      visible: (item) => item.estado === PaquetesEstados.Asignado,
    },

    track: {
      key: "track",
      label: "",
      tooltip: "Rastrear paquete",
      icon: <MapPin className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onTrack,
      visible: (item) => item.estado === PaquetesEstados.Entregado,
    },
  };

  return actions[key];
};

// ===================== TIPOS PARA CALLBACKS =====================
export interface PaquetesActionCallbacks {
  onView: (item: Paquete) => void;
  onEdit: (item: Paquete) => void;
  onDelete: (item: Paquete) => void;
  onAssign: (item: Paquete) => void;
  onCancelAssignment: (item: Paquete) => void;
  onReassign: (item: Paquete) => void;
  onMarkEntregado: (item: Paquete) => void;
  onMarkFallido: (item: Paquete) => void;
  onDownloadLabel: (item: Paquete) => void;
  onTrack: (item: Paquete) => void;
}

// ===================== HELPERS =====================
export const getColumnsForEstado = (
  estado: PaquetesEstados
): ColumnDef<Paquete>[] => {
  const keys: PaquetesColumnKey[] = COLUMNS_BY_ESTADO[estado];
  return keys.map((k: PaquetesColumnKey) => PAQUETES_COLUMNS[k]);
};

export const getActionsForEstado = (
  estado: PaquetesEstados,
  callbacks: PaquetesActionCallbacks
): ActionButton<Paquete>[] => {
  const keys: PaquetesActionKey[] = ACTIONS_BY_ESTADO[estado];
  return keys.map((k: PaquetesActionKey) => createPaqueteAction(k, callbacks));
};