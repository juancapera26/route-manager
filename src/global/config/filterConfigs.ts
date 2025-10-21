// src/global/filterConfigs.ts
import {
  PaquetesEstados,
  ConductorEstado,
  RutaEstado,
  Paquete,
  Conductor,
} from "../types";
import { OpcionesFiltro } from "../../hooks/useEstadoFilter";
import { Ruta } from "../types/rutas";

// ===================== Configuración para Paquetes =====================
export const opcionesFiltorPaquetes: OpcionesFiltro<PaquetesEstados> = [
  { valor: null, etiqueta: "Todos" },
  { valor: PaquetesEstados.Pendiente, etiqueta: "Pendientes" },
  { valor: PaquetesEstados.Asignado, etiqueta: "Asignados" },
  { valor: PaquetesEstados.EnRuta, etiqueta: "En Ruta" },
  { valor: PaquetesEstados.Entregado, etiqueta: "Entregados" },
  { valor: PaquetesEstados.Fallido, etiqueta: "Fallidos" },
];

export const obtenerEstadoPaquete = (paquete: Paquete): PaquetesEstados =>
  paquete.estado;

// ===================== Configuración para Conductores =====================
export const opcionesFitroConductores: OpcionesFiltro<ConductorEstado> = [
  { valor: null, etiqueta: "Todos" },
  { valor: ConductorEstado.Disponible, etiqueta: "Disponibles" },
  { valor: ConductorEstado.EnRuta, etiqueta: "En Ruta" },
  { valor: ConductorEstado.NoDisponible, etiqueta: "No Disponibles" },
];

export const obtenerEstadoConductor = (conductor: Conductor): ConductorEstado =>
  conductor.estado;

// ===================== Configuración para Rutas =====================
export const opcionesFiltroRutas: OpcionesFiltro<RutaEstado> = [
  { valor: null, etiqueta: "Todas" },
  { valor: RutaEstado.Pendiente, etiqueta: "Pendientes" },
  { valor: RutaEstado.Asignada, etiqueta: "Asignadas" },
  { valor: RutaEstado.Completada, etiqueta: "Completadas" },
  { valor: RutaEstado.Fallida, etiqueta: "Fallidas" },
];

export const obtenerEstadoRuta = (ruta: Ruta): RutaEstado => ruta.estado_ruta;
