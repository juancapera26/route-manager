// ---- Api simulada, Gestión de Rutas ----
import {
  mockRutas,
  mockConductores,
  Ruta,
  RutaEstado,
  ConductorEstado,
} from "./dataMock";

const SIMULATED_DELAY = 120;
const simulateRequest = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), SIMULATED_DELAY));

type Ok = { success: true; message?: string };
type Fail = { success: false; message: string };
type Result = Ok | Fail;

// ===================== Helpers =====================
const nowISO = () => new Date().toISOString();

const findRutaIndex = (id: string) =>
  mockRutas.findIndex((r) => r.id_ruta === id);

const getConductorById = (id: string | null) =>
  id ? mockConductores.find((c) => c.id_conductor === id) ?? null : null;

// ===================== Listados =====================
export const getRutas = async (): Promise<Ruta[]> =>
  simulateRequest([...mockRutas]);

export const getRutasPendientes = async (): Promise<Ruta[]> =>
  simulateRequest(mockRutas.filter((r) => r.estado === RutaEstado.Pendiente));

// ===================== CRUD rutas =====================
const generateRutaId = (): string => {
  const lastId = mockRutas.at(-1)?.id_ruta ?? "RTA-000";
  const lastNum = parseInt(lastId.split("-")[1], 10);
  return `RTA-${String(lastNum + 1).padStart(3, "0")}`;
};

export const createRuta = async (
  data: Omit<Ruta, "id_ruta" | "fecha_registro" | "estado" | "paquetes_asignados" | "id_conductor_asignado">
): Promise<Ruta> => {
  const nueva: Ruta = {
    ...data,
    id_ruta: generateRutaId(),
    fecha_registro: nowISO(),
    estado: RutaEstado.Pendiente,
    paquetes_asignados: [],
    id_conductor_asignado: null,
  };
  mockRutas.push(nueva);
  return simulateRequest(nueva);
};

export const updateRuta = async (
  id: string,
  data: Partial<Ruta>
): Promise<Result> => {
  const i = findRutaIndex(id);
  if (i === -1)
    return simulateRequest({ success: false, message: "Ruta no existe." });
  mockRutas[i] = { ...mockRutas[i], ...data };
  return simulateRequest({ success: true, message: "Ruta actualizada." });
};

export const deleteRuta = async (id: string): Promise<Result> => {
  const i = findRutaIndex(id);
  if (i !== -1 && mockRutas[i].estado === RutaEstado.Pendiente) {
    mockRutas.splice(i, 1);
    return simulateRequest({ success: true, message: "Ruta eliminada." });
  }
  return simulateRequest({ success: false, message: "No se puede eliminar." });
};

// ===================== Flujo: Asignación =====================
export const asignarConductorARuta = async (
  idRuta: string,
  idConductor: string
): Promise<Result> => {
  const rIdx = findRutaIndex(idRuta);
  if (rIdx === -1)
    return simulateRequest({ success: false, message: "Ruta no existe." });

  const ruta = mockRutas[rIdx];
  if (ruta.estado !== RutaEstado.Pendiente)
    return simulateRequest({ success: false, message: "Ruta no disponible." });

  const conductor = getConductorById(idConductor);
  if (!conductor)
    return simulateRequest({ success: false, message: "Conductor no existe." });
  if (conductor.estado !== ConductorEstado.Disponible)
    return simulateRequest({ success: false, message: "Conductor no disponible." });

  // Persistencia simulada
  ruta.id_conductor_asignado = conductor.id_conductor;
  ruta.estado = RutaEstado.asignada;

  conductor.estado = ConductorEstado.EnRuta;

  return simulateRequest({ success: true, message: "Conductor asignado a la ruta." });
};

export const cancelarAsignacionRuta = async (idRuta: string): Promise<Result> => {
  const rIdx = findRutaIndex(idRuta);
  if (rIdx === -1)
    return simulateRequest({ success: false, message: "Ruta no existe." });

  const ruta = mockRutas[rIdx];
  if (ruta.estado !== RutaEstado.asignada)
    return simulateRequest({ success: false, message: "Ruta no está asignada." });

  // liberar conductor
  if (ruta.id_conductor_asignado) {
    const conductor = getConductorById(ruta.id_conductor_asignado);
    if (conductor) conductor.estado = ConductorEstado.Disponible;
    ruta.id_conductor_asignado = null;
  }

  ruta.estado = RutaEstado.Pendiente;

  return simulateRequest({ success: true, message: "Asignación cancelada." });
};

// ===================== Flujo: Finalización =====================
export const completarRuta = async (idRuta: string): Promise<Result> => {
  const rIdx = findRutaIndex(idRuta);
  if (rIdx === -1)
    return simulateRequest({ success: false, message: "Ruta no existe." });

  const ruta = mockRutas[rIdx];
  if (ruta.estado !== RutaEstado.asignada)
    return simulateRequest({ success: false, message: "Ruta no se puede completar." });

  ruta.estado = RutaEstado.Completada;

  if (ruta.id_conductor_asignado) {
    const conductor = getConductorById(ruta.id_conductor_asignado);
    if (conductor) conductor.estado = ConductorEstado.Disponible;
  }

  return simulateRequest({ success: true, message: "Ruta completada." });
};


export const marcarRutaFallida = async (idRuta: string): Promise<Result> => {
  const rIdx = findRutaIndex(idRuta);
  if (rIdx === -1)
    return simulateRequest({ success: false, message: "Ruta no existe." });

  const ruta = mockRutas[rIdx];
  ruta.estado = RutaEstado.Fallida;

  if (ruta.id_conductor_asignado) {
    const conductor = getConductorById(ruta.id_conductor_asignado);
    if (conductor) conductor.estado = ConductorEstado.Disponible;
    // Ojo: NO borramos ruta.id_conductor_asignado
  }

  return simulateRequest({ success: true, message: "Ruta marcada como fallida." });
};

