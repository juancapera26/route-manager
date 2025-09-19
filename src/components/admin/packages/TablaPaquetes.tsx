// src/global/types/tableTypes.ts
import React from "react";
import { Paquete, PaquetesEstados } from "../../../global/types";
import { ColumnDef, ActionButton } from "../../ui/table/DataTable";
import Badge,  {BadgeColor} from "../../ui/badge/Badge";

// Importar iconos de Lucide React
import {
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  X,
  RotateCcw,
  Truck,
  Check,
  Download,
  MapPin,
  AlertTriangle, // NUEVO: Para mark_fallido
} from "lucide-react";

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
  | "mark_en_ruta"
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
      // Aquí necesitarás obtener el nombre del conductor desde el ID
      // Por ahora retorna el ID, pero deberías implementar una función para obtener el nombre
      return item.id_conductor_asignado ? (
        `${item.id_conductor_asignado}` // Aquí deberías obtener el nombre real
      ) : (
        <span className="text-gray-400 italic">Sin asignar</span>
      );
    },
    sortable: true,
  },

  ruta_asignada: {
    key: "ruta_asignada",
    header: "Ruta",
    accessor: (item) => {
      if (!item.id_rutas_asignadas || item.id_rutas_asignadas.length === 0) {
        return <span className="text-gray-400 italic">Sin asignar</span>;
      }
      return (
        <span className="text-sm font-mono">
          {item.id_rutas_asignadas[0]} {/* Mostrar solo la primera ruta */}
        </span>
      );
    },
    className: "text-sm",
  },

  destinatario: {
    key: "destinatario",
    header: "Destinatario",
    accessor: (item) =>
      `${item.destinatario.nombre} ${item.destinatario.apellido}`,
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
      // Mapear el estado a un color del componente Badge
      const colorMap: Record<PaquetesEstados, BadgeColor> = {
        [PaquetesEstados.Pendiente]: "warning",
        [PaquetesEstados.Asignado]: "info",
        [PaquetesEstados.EnRuta]: "primary",
        [PaquetesEstados.Entregado]: "success",
        [PaquetesEstados.Fallido]: "error",
      };

      return (
        <Badge
          variant="light" // Puedes cambiar a "solid" si prefieres
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
    "conductor_nombre",
    "ruta_asignada",
    "destinatario",
    "fecha_registro",
    "fecha_entrega",
  ],
  [PaquetesEstados.Asignado]: [
    "id_paquete",
    "conductor_nombre",
    "ruta_asignada",
    "destinatario",
    "fecha_registro",
    "fecha_entrega",
  ],
  [PaquetesEstados.EnRuta]: [
    "id_paquete",
    "conductor_nombre",
    "ruta_asignada",
    "destinatario",
    "fecha_registro",
    "fecha_entrega",
  ],
  [PaquetesEstados.Entregado]: [
    "id_paquete",
    "conductor_nombre",
    "ruta_asignada",
    "destinatario",
    "fecha_registro",
    "fecha_entrega",
  ],
  [PaquetesEstados.Fallido]: [
    "id_paquete",
    "conductor_nombre",
    "ruta_asignada",
    "destinatario",
    "fecha_registro",
    "fecha_entrega",
  ],
};

// ===================== ACCIONES ACTUALIZADAS =====================
const ACTIONS_BY_ESTADO: Record<PaquetesEstados, PaquetesActionKey[]> = {
  [PaquetesEstados.Pendiente]: ["view", "edit", "delete", "assign"],
  [PaquetesEstados.Asignado]: [
    "view",
    "cancel_assignment",
    "mark_en_ruta",
    "mark_fallido",
  ],
  [PaquetesEstados.EnRuta]: ["view", "mark_entregado", "mark_fallido", "track"],
  [PaquetesEstados.Entregado]: ["view", "track"],
  [PaquetesEstados.Fallido]: ["view", "edit", "delete", "reassign"],
};


// ===================== DEFINICIÓN DE ACCIONES BASE - CORREGIDO =====================
export const createPaqueteAction = (
  key: PaquetesActionKey,
  callbacks: PaquetesActionCallbacks
): ActionButton<Paquete> => {
  const actions: Record<PaquetesActionKey, ActionButton<Paquete>> = {
    view: {
      key: "view",
      label: "", // Sin texto en el botón
      tooltip: "Ver detalles del paquete", // Texto para el tooltip
      icon: <Eye className="w-4 h-4" />,
      variant: "outline",
      onClick: callbacks.onView,
    },
    edit: {
      key: "edit",
      label: "",
      tooltip: "Editar paquete",
      icon: <Edit className="w-4 h-4" />,
      variant: "secondary", // Azul como en los iconos de referencia
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
      variant: "destructive", // Rojo
      onClick: callbacks.onDelete,
      visible: (item) => {
        console.log(`🗑️ DELETE - Paquete ${item.id_paquete}, Estado: ${item.estado}`);
        const shouldShow = [
          PaquetesEstados.Pendiente,
          PaquetesEstados.Fallido,
        ].includes(item.estado);
        console.log(`🗑️ DELETE - Should show: ${shouldShow}`);
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
      variant: "default", // Primary (azul)
      onClick: callbacks.onAssign,
      visible: (item) => item.estado === PaquetesEstados.Pendiente,
    },
    reassign: {
      key: "reassign",
      label: "",
      tooltip: "Reasignar paquete",
      icon: <RotateCcw className="w-4 h-4" />,
      variant: "default", // Primary (azul)
      onClick: callbacks.onReassign,
      visible: (item) => item.estado === PaquetesEstados.Fallido,
    },
    cancel_assignment: {
      key: "cancel_assignment",
      label: "",
      tooltip: "Cancelar asignación",
      icon: <X className="w-4 h-4" />,
      variant: "destructive", // Rojo
      onClick: callbacks.onCancelAssignment,
      visible: (item) => item.estado === PaquetesEstados.Asignado,
    },
    mark_en_ruta: {
      key: "mark_en_ruta",
      label: "",
      tooltip: "Marcar como en ruta",
      icon: <Truck className="w-4 h-4" />,
      variant: "default", // Primary (azul)
      onClick: callbacks.onMarkEnRuta,
      visible: (item) => item.estado === PaquetesEstados.Asignado,
    },
    mark_entregado: {
      key: "mark_entregado",
      label: "",
      tooltip: "Marcar como entregado",
      icon: <Check className="w-4 h-4" />,
      variant: "default", // Primary (azul)
      onClick: callbacks.onMarkEntregado,
      visible: (item) => item.estado === PaquetesEstados.EnRuta,
    },
    mark_fallido: {
      key: "mark_fallido",
      label: "",
      tooltip: "Marcar como fallido",
      icon: <AlertTriangle className="w-4 h-4" />, // CAMBIADO: Icono diferente a delete
      variant: "outline", // Outline (gris) como solicitaste
      onClick: callbacks.onMarkFallido,
      visible: (item) =>
        [PaquetesEstados.Asignado, PaquetesEstados.EnRuta].includes(item.estado),
    },
    track: {
      key: "track",
      label: "",
      tooltip: "Rastrear paquete",
      icon: <MapPin className="w-4 h-4" />,
      variant: "default", // Primary (azul)
      onClick: callbacks.onTrack,
      visible: (item) =>
        [PaquetesEstados.EnRuta, PaquetesEstados.Entregado].includes(item.estado),
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