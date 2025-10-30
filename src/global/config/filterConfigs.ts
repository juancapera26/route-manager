// src/global/filterConfigs.ts
import { PaquetesEstados, Paquete } from "../types/paquete.types";

import { OpcionesFiltro } from "../../hooks/useEstadoFilter";
import { Ruta, RutaEstado } from "../types/rutas";

// ===================== Configuración para Paquetes =====================
export const opcionesFiltorPaquetes: OpcionesFiltro<PaquetesEstados> = [
  { valor: null, etiqueta: "Todos" },
  { valor: PaquetesEstados.Pendiente, etiqueta: "Pendientes" },
  { valor: PaquetesEstados.Asignado, etiqueta: "Asignados" },
  { valor: PaquetesEstados.Entregado, etiqueta: "Entregados" },
  { valor: PaquetesEstados.Fallido, etiqueta: "Fallidos" },
];

export const obtenerEstadoPaquete = (paquete: Paquete): PaquetesEstados =>
  paquete.estado;

// ===================== Configuración para Rutas =====================
export const opcionesFiltroRutas: OpcionesFiltro<RutaEstado> = [
  { valor: null, etiqueta: "Todas" },
  { valor: RutaEstado.Pendiente, etiqueta: "Pendientes" },
  { valor: RutaEstado.Asignada, etiqueta: "Asignadas" },
  { valor: RutaEstado.Completada, etiqueta: "Completadas" },
  { valor: RutaEstado.Fallida, etiqueta: "Fallidas" },
];

export const obtenerEstadoRuta = (ruta: Ruta): RutaEstado => ruta.estado_ruta;
