// src/global/types/tableTypes.ts
import React from "react";
import { Paquete, PaquetesEstados } from "../../../global/types/paquete.types";
import { ColumnDef, ActionButton } from "../../ui/table/DataTable";
import Badge, { BadgeColor } from "../../ui/badge/Badge";
// Importar iconos de Lucide React
import {Eye,Edit,Trash2,ArrowRight,X,RotateCcw,Truck,Check,Download,MapPin,AlertTriangle,} from "lucide-react";
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

  // ✅ CORREGIDO: Ahora usa la relación correcta
  conductor_nombre: {
    key: "conductor_nombre",
    header: "Conductor",
    accessor: (item) => {
      // TODO: Cuando tengas la relación con conductor desde ruta
      // Por ahora solo muestra "Asignado" o "Sin asignar"
      if (item.id_ruta) {
        return (
          <span className="text-sm">Asignado</span> // ← Temporal
        );
      }
      return <span className="text-gray-400 italic">Sin asignar</span>;
    },
    sortable: false,
  },

  // ✅ CORREGIDO: Ahora usa id_ruta (singular)
  ruta_asignada: {
    key: "ruta_asignada",
    header: "Ruta",
    accessor: (item) => {
      if (!item.id_ruta) {
        return <span className="text-gray-400 italic">Sin asignar</span>;
      }
      return (
        <span className="text-sm font-mono">
          Ruta #{item.id_ruta}
        </span>
      );
    },
    className: "text-sm",
  },

  // ✅ CORREGIDO: Ahora usa la relación cliente
  destinatario: {
    key: "destinatario",
    header: "Destinatario",
    accessor: (item) => {
      // Si el backend incluye la relación cliente
      if (item.cliente) {
        return `${item.cliente.nombre} ${item.cliente.apellido}`;
      }
      // Si no, muestra "Desconocido" (esto no debería pasar)
      return <span className="text-gray-400 italic">Desconocido</span>;
    },
    sortable: true,
  },

  fecha_registro: {
    key: "fecha_registro",
    header: "Registro",
    accessor: (item) =>
      new Date(item.fecha_registro).toLocaleDateString("es-ES"),
    sortable: true,
  },

  fecha_entrega: {
    key: "fecha_entrega",
    header: "Entrega",
    accessor: (item) =>
      item.fecha_entrega ? (
        new Date(item.fecha_entrega).toLocaleDateString("es-ES")
      ) : (
        <span className="text-gray-400 italic">Pendiente</span>
      ),
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

// ===================== COLUMNAS POR ESTADO SIMPLIFICADAS =====================
const COLUMNS_BY_ESTADO: Record<PaquetesEstados, PaquetesColumnKey[]> = {
  [PaquetesEstados.Pendiente]: [
    "id_paquete",
    "destinatario",
    "fecha_registro",
    "estado",
  ],
  [PaquetesEstados.Asignado]: [
    "id_paquete",
    "ruta_asignada",
    "destinatario",
    "fecha_registro",
    "estado",
  ],
  [PaquetesEstados.Entregado]: [
    "id_paquete",
    "ruta_asignada",
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
  [PaquetesEstados.Asignado]: [
    "view",
    "cancel_assignment",
    "mark_fallido",
  ],
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
      disabled: (item) =>
        ![PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(item.estado),
    },
    delete: {
      key: "delete",
      label: "",
      tooltip: "Eliminar paquete",
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
      onClick: callbacks.onDelete,
      visible: (item) => {
        const shouldShow = [
          PaquetesEstados.Pendiente,
          PaquetesEstados.Fallido,
        ].includes(item.estado);
        return shouldShow;
      },
      disabled: (item) =>
        ![PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(item.estado),
    },
    assign: {
      key: "assign",
      label: "",
      tooltip: "Asignar paquete",
      icon: <ArrowRight className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onAssign,
      visible: (item) => item.estado === PaquetesEstados.Pendiente,
    },
    reassign: {
      key: "reassign",
      label: "",
      tooltip: "Reasignar paquete",
      icon: <RotateCcw className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onReassign,
      visible: (item) => item.estado === PaquetesEstados.Fallido,
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
    mark_entregado: {
      key: "mark_entregado",
      label: "",
      tooltip: "Marcar como entregado",
      icon: <Check className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onMarkEntregado,
    },
    mark_fallido: {
      key: "mark_fallido",
      label: "",
      tooltip: "Marcar como fallido",
      icon: <AlertTriangle className="w-4 h-4" />,
      variant: "outline",
      onClick: callbacks.onMarkFallido,
    },
    track: {
      key: "track",
      label: "",
      tooltip: "Rastrear paquete",
      icon: <MapPin className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onTrack,
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
  onMarkEnRuta: (item: Paquete) => void;
  onMarkEntregado: (item: Paquete) => void;
  onMarkFallido: (item: Paquete) => void;
  onDownloadLabel: (item: Paquete) => void;
  onTrack: (item: Paquete) => void;
}