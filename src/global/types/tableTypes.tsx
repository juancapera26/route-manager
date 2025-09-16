// src/global/types/tableTypes.ts
import React from "react";
import { Paquete, PaquetesEstados } from "../types";
import { ColumnDef, ActionButton } from "../../components/ui/table/DataTable";

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
    accessor: (item) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoBadgeClasses(
          item.estado
        )}`}
      >
        {item.estado}
      </span>
    ),
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

// ===================== HELPER PARA CLASES DE ESTADO =====================
function getEstadoBadgeClasses(estado: PaquetesEstados): string {
  const classes = {
    [PaquetesEstados.Pendiente]:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    [PaquetesEstados.Asignado]:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    [PaquetesEstados.EnRuta]:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    [PaquetesEstados.Entregado]:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    [PaquetesEstados.Fallido]:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    classes[estado] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  );
}

// ===================== DEFINICIÓN DE ACCIONES BASE - CORREGIDO =====================
// ===================== DEFINICIÓN DE ACCIONES BASE - CORREGIDO =====================
export const createPaqueteAction = (
  key: PaquetesActionKey,
  callbacks: PaquetesActionCallbacks
): ActionButton<Paquete> => {
  const actions: Record<PaquetesActionKey, ActionButton<Paquete>> = {
    view: {
      key: "view",
      label: "",
      icon: <Eye className="w-4 h-4" />,
      variant: "outline",
      onClick: callbacks.onView,
      // ✅ Visible para todos los estados
    },

    edit: {
      key: "edit",
      label: "",
      icon: <Edit className="w-4 h-4" />,
      variant: "outline",
      onClick: callbacks.onEdit,
      // ✅ Solo visible/habilitado para Pendiente y Fallido
      visible: (item) =>
        [PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(
          item.estado
        ),
      disabled: (item) =>
        ![PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(
          item.estado
        ),
    },

    delete: {
      key: "delete",
      label: "",
      icon: <Trash2 className="w-4 h-4" />,
      variant: "destructive",
      onClick: callbacks.onDelete,
      // ✅ Solo visible/habilitado para Pendiente y Fallido
      visible: (item) =>
        [PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(
          item.estado
        ),
      disabled: (item) =>
        ![PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(
          item.estado
        ),
    },

    assign: {
      key: "assign",
      label: "",
      icon: <ArrowRight className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onAssign,
      // ✅ Solo visible para Pendiente
      visible: (item) => item.estado === PaquetesEstados.Pendiente,
    },

    reassign: {
      key: "reassign",
      label: "",
      icon: <RotateCcw className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onReassign,
      // ✅ Solo visible para Fallido
      visible: (item) => item.estado === PaquetesEstados.Fallido,
    },

    cancel_assignment: {
      key: "cancel_assignment",
      label: "",
      icon: <X className="w-4 h-4" />,
      variant: "destructive",
      onClick: callbacks.onCancelAssignment,
      // ✅ CORREGIDO: Solo visible para Asignado (removido EnRuta)
      visible: (item) => item.estado === PaquetesEstados.Asignado,
    },

    mark_en_ruta: {
      key: "mark_en_ruta",
      label: "",
      icon: <Truck className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onMarkEnRuta,
      // ✅ Solo visible para Asignado
      visible: (item) => item.estado === PaquetesEstados.Asignado,
    },

    mark_entregado: {
      key: "mark_entregado",
      label: "",
      icon: <Check className="w-4 h-4" />,
      variant: "default",
      onClick: callbacks.onMarkEntregado,
      // ✅ Solo visible para EnRuta
      visible: (item) => item.estado === PaquetesEstados.EnRuta,
    },

    mark_fallido: {
      key: "mark_fallido",
      label: "",
      icon: <Trash2 className="w-4 h-4" />, // ✅ CAMBIADO: Usamos Trash2 en lugar de X
      variant: "destructive",
      onClick: callbacks.onMarkFallido,
      // ✅ Solo visible para Asignado y EnRuta
      visible: (item) =>
        [PaquetesEstados.Asignado, PaquetesEstados.EnRuta].includes(
          item.estado
        ),
    },

    track: {
      key: "track",
      label: "",
      icon: <MapPin className="w-4 h-4" />,
      variant: "outline",
      onClick: callbacks.onTrack,
      // ✅ Solo visible para EnRuta y Entregado
      visible: (item) =>
        [PaquetesEstados.EnRuta, PaquetesEstados.Entregado].includes(
          item.estado
        ),
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
