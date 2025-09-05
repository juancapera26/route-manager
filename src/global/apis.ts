const ENV_PATH = import.meta.env;

const FIREBASE_API_KEY = ENV_PATH.VITE_FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = ENV_PATH.VITE_FIREBASE_AUTH_DOMAIN;
const FIREBASE_DATABASE_URL = ENV_PATH.VITE_FIREBASE_DATABASE_URL;
const FIREBASE_PROJECT_ID = ENV_PATH.VITE_FIREBASE_PROJECT_ID;
const FIREBASE_STORAGE_BUCKET = ENV_PATH.VITE_FIREBASE_STORAGE_BUCKET;
const FIREBASE_MESSAGING_SENDER_ID = ENV_PATH.VITE_FIREBASE_MESSAGING_SENDER_ID;
const FIREBASE_APP_ID = ENV_PATH.VITE_FIREBASE_APP_ID;
const FIREBASE_MEASUREMENT_ID = ENV_PATH.VITE_FIREBASE_MEASUREMENT_ID;

export {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
};










// ---- Api simulada, Gestión de Paquetes ----
import {
  mockPaquetes, mockConductores, mockRutas,
  Paquete, PaquetesEstados, Conductor, Ruta,
  ConductorEstado, RutaEstado
} from './dataMock';

const SIMULATED_DELAY = 120;
const simulateRequest = <T>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), SIMULATED_DELAY));

type Ok = { success: true; message?: string };
type Fail = { success: false; message: string };
type Result = Ok | Fail;

// ===================== Helpers comunes =====================
const nowISO = () => new Date().toISOString();

const findPaqueteIndex = (id: string) =>
  mockPaquetes.findIndex(p => p.id_paquete === id);

const findRutaIndex = (id: string) =>
  mockRutas.findIndex(r => r.id_ruta === id);

const getConductorById = (id: string | null) =>
  id ? mockConductores.find(c => c.id_conductor === id) ?? null : null;

const pickConductorDisponible = (): Conductor | null =>
  mockConductores.find(c => c.estado === ConductorEstado.Disponible) ?? null;

// Si la ruta ya tiene conductor válido, úsalo; si no, elige uno disponible.
const pickConductorParaRuta = (ruta: Ruta): Conductor | null => {
  const ya = getConductorById(ruta.id_conductor_asignado);
  if (ya) return ya;
  return pickConductorDisponible();
};

// ===================== Listados =====================
export const getPaquetes = async (
  searchQuery?: string,
  estado?: PaquetesEstados | null,
  fromDate?: string,
  toDate?: string
): Promise<Paquete[]> => {
  let paquetes = [...mockPaquetes];
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    paquetes = paquetes.filter(p =>
      p.id_paquete.toLowerCase().includes(q) ||
      p.destinatario.nombre.toLowerCase().includes(q)
    );
  }
  if (estado) paquetes = paquetes.filter(p => p.estado === estado);
  if (fromDate) paquetes = paquetes.filter(p => new Date(p.fecha_registro) >= new Date(fromDate));
  if (toDate) paquetes = paquetes.filter(p => new Date(p.fecha_registro) <= new Date(toDate));
  paquetes.sort((a, b) => +new Date(b.fecha_registro) - +new Date(a.fecha_registro));
  return simulateRequest(paquetes);
};

export const getRutas = async (): Promise<Ruta[]> => simulateRequest(mockRutas);
export const getConductores = async (): Promise<Conductor[]> => simulateRequest(mockConductores);

// Rutas auxiliares para modales
export const getRutasPendientes = async (): Promise<Ruta[]> =>
  simulateRequest(mockRutas.filter(r => r.estado === RutaEstado.Pendiente));

export const getRutasDisponiblesParaReasignacion = async (paqueteId: string): Promise<Ruta[]> =>
  simulateRequest(
    mockRutas.filter(r =>
      r.estado === RutaEstado.Pendiente && !r.paquetes_asignados.includes(paqueteId)
    )
  );

// ===================== CRUD paquetes =====================
export const createPaquete = async (
  data: Omit<Paquete, 'id_paquete'|'fecha_registro'|'estado'|'fecha_entrega'|'id_rutas_asignadas'|'id_conductor_asignado'>
): Promise<Paquete> => {
  const nuevo: Paquete = {
    ...data,
    id_paquete: `PAQ-${Date.now()}`,
    fecha_registro: nowISO(),
    estado: PaquetesEstados.Pendiente,
    fecha_entrega: null,
    id_rutas_asignadas: [],
    id_conductor_asignado: null,
  };
  mockPaquetes.push(nuevo);
  return simulateRequest(nuevo);
};

export const updatePaquete = async (id: string, data: Partial<Paquete>): Promise<Result> => {
  const i = findPaqueteIndex(id);
  if (i === -1) return simulateRequest({ success:false, message:'Paquete no existe.' });
  const editable = [PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(mockPaquetes[i].estado);
  if (!editable) return simulateRequest({ success:false, message:'No editable en este estado.' });
  mockPaquetes[i] = { ...mockPaquetes[i], ...data };
  return simulateRequest({ success:true });
};

export const deletePaquete = async (id: string): Promise<Result> => {
  const i = findPaqueteIndex(id);
  if (i !== -1 && [PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(mockPaquetes[i].estado)) {
    mockPaquetes.splice(i, 1);
    return simulateRequest({ success:true, message:'Paquete eliminado.' });
  }
  return simulateRequest({ success:false, message:'No se puede eliminar.' });
};

// ===================== Flujo de asignación =====================
// Nota: conductorId ahora es opcional; si no viene, se resuelve automáticamente.
export const assignPaquete = async (id: string, rutaId: string, conductorId?: string): Promise<Result> => {
  const pIdx = findPaqueteIndex(id);
  const rIdx = findRutaIndex(rutaId);
  if (pIdx === -1 || rIdx === -1) return simulateRequest({ success:false, message:'Paquete o ruta no existe.' });

  const paquete = mockPaquetes[pIdx];
  if (![PaquetesEstados.Pendiente, PaquetesEstados.Fallido].includes(paquete.estado))
    return simulateRequest({ success:false, message:'Estado no permite asignar.' });

  const ruta = mockRutas[rIdx];
  if (ruta.estado !== RutaEstado.Pendiente)
    return simulateRequest({ success:false, message:'Ruta no disponible.' });

  let conductor = conductorId ? getConductorById(conductorId) : pickConductorParaRuta(ruta);
  if (!conductor) return simulateRequest({ success:false, message:'Sin conductor disponible.' });
  if (conductor.estado === ConductorEstado.NoDisponible)
    return simulateRequest({ success:false, message:'Conductor no disponible.' });

  // Persistencia simulada
  if (!ruta.paquetes_asignados.includes(id)) ruta.paquetes_asignados.push(id);
  ruta.id_conductor_asignado = conductor.id_conductor;

  paquete.id_rutas_asignadas.push(rutaId);
  paquete.id_conductor_asignado = conductor.id_conductor;
  paquete.estado = PaquetesEstados.Asignado;

  return simulateRequest({ success:true, message:'Paquete asignado.' });
};

export const cancelPaqueteAssignment = async (id: string, rutaId: string): Promise<Result> => {
  const pIdx = findPaqueteIndex(id);
  const rIdx = findRutaIndex(rutaId);
  if (pIdx === -1 || rIdx === -1) return simulateRequest({ success:false, message:'Paquete o ruta no existe.' });

  const paquete = mockPaquetes[pIdx];
  const ruta = mockRutas[rIdx];

  if (![PaquetesEstados.Asignado, PaquetesEstados.EnRuta].includes(paquete.estado))
    return simulateRequest({ success:false, message:'No cancelable en este estado.' });

  paquete.id_rutas_asignadas = paquete.id_rutas_asignadas.filter(r => r !== rutaId);
  ruta.paquetes_asignados = ruta.paquetes_asignados.filter(pid => pid !== id);

  // Si la ruta queda sin paquetes, opcionalmente podría liberar conductor
  if (ruta.paquetes_asignados.length === 0) {
    // No cambiamos estado de ruta; mantenemos "Pendiente" para nuevos paquetes.
    // Si quieres: ruta.id_conductor_asignado = null;
  }

  if (paquete.id_rutas_asignadas.length === 0) {
    paquete.estado = PaquetesEstados.Pendiente;
    paquete.id_conductor_asignado = null;
  }

  return simulateRequest({ success:true, message:'Asignación cancelada.' });
};

export const reassignPaquete = async (
  id: string,
  nuevaRutaId: string,
  nuevoConductorId?: string,
  observacion?: string
): Promise<Result> => {
  const pIdx = findPaqueteIndex(id);
  const rIdx = findRutaIndex(nuevaRutaId);
  if (pIdx === -1 || rIdx === -1) return simulateRequest({ success:false, message:'Paquete o ruta no existe.' });

  const paquete = mockPaquetes[pIdx];
  if (paquete.estado !== PaquetesEstados.Fallido)
    return simulateRequest({ success:false, message:'Solo paquetes Fallidos pueden reasignarse.' });

  const ruta = mockRutas[rIdx];
  if (ruta.estado !== RutaEstado.Pendiente)
    return simulateRequest({ success:false, message:'Ruta no disponible.' });

  let conductor = nuevoConductorId ? getConductorById(nuevoConductorId) : pickConductorParaRuta(ruta);
  if (!conductor) return simulateRequest({ success:false, message:'Sin conductor disponible.' });

  paquete.id_rutas_asignadas.push(nuevaRutaId);
  paquete.id_conductor_asignado = conductor.id_conductor;
  paquete.estado = PaquetesEstados.Asignado;
  if (observacion) paquete.observacion_conductor = observacion;

  ruta.id_conductor_asignado = conductor.id_conductor;
  if (!ruta.paquetes_asignados.includes(id)) ruta.paquetes_asignados.push(id);

  return simulateRequest({ success:true, message:'Paquete reasignado.' });
};

// ===================== Estados de flujo del paquete =====================
export const markEnRuta    = async (id: string): Promise<boolean> =>
  setEstado(id, PaquetesEstados.EnRuta);

export const markEntregado = async (id: string, obs?: string, imagen?: string): Promise<boolean> =>
  setEstado(id, PaquetesEstados.Entregado, { fecha_entrega: nowISO(), observacion_conductor: obs, imagen_adjunta: imagen });

export const markFallido   = async (id: string, obs?: string): Promise<boolean> =>
  setEstado(id, PaquetesEstados.Fallido, { observacion_conductor: obs });

const setEstado = async (id: string, estado: PaquetesEstados, extra: Partial<Paquete> = {}): Promise<boolean> => {
  const i = findPaqueteIndex(id);
  if (i === -1) return simulateRequest(false);
  mockPaquetes[i] = { ...mockPaquetes[i], estado, ...extra };
  return simulateRequest(true);
};
