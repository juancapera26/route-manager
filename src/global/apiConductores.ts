// ---- Api simulada, Gestión de Conductores ----
/*
import {
  Conductor,
  ConductorEstado,
  Empresa,
  RutaEstado,
  PaquetesEstados,
} from "./types";
import {
  mockConductores,
  mockVehiculos,
  mockRutas,
  mockPaquetes,
} from "./dataMock";

const SIMULATED_DELAY = 120;
const simulateRequest = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), SIMULATED_DELAY));

type Ok = { success: true; message?: string };
type Fail = { success: false; message: string };
type Result = Ok | Fail;

// ===================== Listados =====================
export const getConductores = async (): Promise<Conductor[]> =>
  simulateRequest([...mockConductores]);

export const getConductorById = async (id: string) => {
  const conductor = mockConductores.find((c) => c.id_conductor === id);
  if (!conductor) return simulateRequest(null);

  const vehiculo = conductor.id_vehiculo_asignado
    ? mockVehiculos.find(
        (v) => v.id_vehiculo === conductor.id_vehiculo_asignado
      )
    : null;

  return simulateRequest({
    ...conductor,
    vehiculo,
  });
};

// ===================== Actualizar estado =====================
export const updateConductorEstado = async (
  id: string,
  nuevoEstado: ConductorEstado
): Promise<Result> => {
  const conductor = mockConductores.find((c) => c.id_conductor === id);
  if (!conductor)
    return simulateRequest({ success: false, message: "Conductor no existe." });

  conductor.estado = nuevoEstado;
  return simulateRequest({ success: true, message: "Estado actualizado." });
};

// ===================== Flujo: asignar ruta =====================
export const asignarRutaAConductor = async (
  idConductor: string,
  idRuta: string
): Promise<Result> => {
  const conductor = mockConductores.find((c) => c.id_conductor === idConductor);
  const ruta = mockRutas.find((r) => r.id_ruta === idRuta);

  if (!conductor)
    return simulateRequest({ success: false, message: "Conductor no existe." });
  if (!ruta)
    return simulateRequest({ success: false, message: "Ruta no existe." });

  if (conductor.estado !== ConductorEstado.Disponible)
    return simulateRequest({
      success: false,
      message: "Conductor no disponible.",
    });

  if (ruta.estado !== RutaEstado.Pendiente)
    return simulateRequest({ success: false, message: "Ruta no disponible." });

  // Persistencia simulada
  ruta.id_conductor_asignado = conductor.id_conductor;
  ruta.estado = RutaEstado.Asignada;
  conductor.estado = ConductorEstado.EnRuta;

  // Actualizar los paquetes de la ruta
  ruta.paquetes_asignados.forEach((idPaquete) => {
    const paquete = mockPaquetes.find((p) => p.id_paquete === idPaquete);
    if (paquete) {
      paquete.id_conductor_asignado = conductor.id_conductor;
      if (paquete.estado === PaquetesEstados.Pendiente) {
        paquete.estado = PaquetesEstados.Asignado;
      }
    }
  });

  return simulateRequest({
    success: true,
    message: "Ruta asignada al conductor.",
  });
};
*/