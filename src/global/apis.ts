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

// =============================================
// APIs Unificadas - Sistema de Paquetería
// =============================================

import {
  mockPaquetes,
  mockConductores,
  mockRutas,
  mockVehiculos,
} from "./dataMock";

import {
  Paquete,
  PaquetesEstados,
  Conductor,
  ConductorEstado,
  Ruta,
  RutaEstado,
  Vehiculo,
  VehiculoEstado,
  Empresa,
} from "./types";

// ===================== TIPOS COMUNES =====================
const SIMULATED_DELAY = 120;

type ApiResponse<T> = Promise<T>;
type ApiResult =
  | { success: true; message?: string }
  | { success: false; message: string };

const simulateRequest = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), SIMULATED_DELAY));

const nowISO = () => new Date().toISOString();

// ===================== HELPERS COMUNES =====================
const findEntityIndex = <T extends { [key: string]: any }>(
  array: T[],
  idField: string,
  id: string
): number => array.findIndex((item) => item[idField] === id);

const generateId = (prefix: string, lastItem?: any, idField = "id"): string => {
  const lastId = lastItem?.[idField] ?? `${prefix}-000`;
  const lastNum = parseInt(lastId.split("-")[1], 10);
  return `${prefix}-${String(lastNum + 1).padStart(3, "0")}`;
};

// ===================== API DE PAQUETES =====================
const paquetesAPI = {
  // Listados y filtros
  async getAll(
    searchQuery?: string,
    estado?: PaquetesEstados | null,
    fromDate?: string,
    toDate?: string
  ): ApiResponse<Paquete[]> {
    let paquetes = [...mockPaquetes];

    // Filtros
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      paquetes = paquetes.filter(
        (p) =>
          p.id_paquete.toLowerCase().includes(q) ||
          p.destinatario.nombre.toLowerCase().includes(q) ||
          p.destinatario.apellido.toLowerCase().includes(q)
      );
    }

    if (estado) {
      paquetes = paquetes.filter((p) => p.estado === estado);
    }

    if (fromDate) {
      paquetes = paquetes.filter(
        (p) => new Date(p.fecha_registro) >= new Date(fromDate)
      );
    }

    if (toDate) {
      paquetes = paquetes.filter(
        (p) => new Date(p.fecha_registro) <= new Date(toDate)
      );
    }

    // Ordenar por fecha de registro (más reciente primero)
    paquetes.sort(
      (a, b) => +new Date(b.fecha_registro) - +new Date(a.fecha_registro)
    );

    return simulateRequest(paquetes);
  },

  async getById(id: string): ApiResponse<Paquete | null> {
    const paquete = mockPaquetes.find((p) => p.id_paquete === id);
    return simulateRequest(paquete || null);
  },

  async getByEstado(estado: PaquetesEstados): ApiResponse<Paquete[]> {
    const paquetes = mockPaquetes.filter((p) => p.estado === estado);
    return simulateRequest(paquetes);
  },

  // CRUD
  async create(
    data: Omit<
      Paquete,
      | "id_paquete"
      | "fecha_registro"
      | "estado"
      | "fecha_entrega"
      | "id_rutas_asignadas"
      | "id_conductor_asignado"
    >
  ): ApiResponse<Paquete> {
    const nuevo: Paquete = {
      ...data,
      id_paquete: generateId("PAQ", mockPaquetes.at(-1), "id_paquete"),
      fecha_registro: nowISO(),
      estado: PaquetesEstados.Pendiente,
      fecha_entrega: null,
      id_rutas_asignadas: [],
      id_conductor_asignado: null,
    };

    mockPaquetes.push(nuevo);
    return simulateRequest(nuevo);
  },

  async update(id: string, data: Partial<Paquete>): ApiResponse<ApiResult> {
    const index = findEntityIndex(mockPaquetes, "id_paquete", id);

    if (index === -1) {
      return simulateRequest({
        success: false,
        message: "Paquete no encontrado",
      });
    }

    const paquete = mockPaquetes[index];
    const estadosEditables = [
      PaquetesEstados.Pendiente,
      PaquetesEstados.Fallido,
    ];

    if (!estadosEditables.includes(paquete.estado)) {
      return simulateRequest({
        success: false,
        message: "No se puede editar un paquete en este estado",
      });
    }

    mockPaquetes[index] = { ...paquete, ...data };
    return simulateRequest({ success: true, message: "Paquete actualizado" });
  },

  async delete(id: string): ApiResponse<ApiResult> {
    const index = findEntityIndex(mockPaquetes, "id_paquete", id);

    if (index === -1) {
      return simulateRequest({
        success: false,
        message: "Paquete no encontrado",
      });
    }

    const paquete = mockPaquetes[index];
    const estadosEliminables = [
      PaquetesEstados.Pendiente,
      PaquetesEstados.Fallido,
    ];

    if (!estadosEliminables.includes(paquete.estado)) {
      return simulateRequest({
        success: false,
        message: "No se puede eliminar un paquete en este estado",
      });
    }

    mockPaquetes.splice(index, 1);
    return simulateRequest({ success: true, message: "Paquete eliminado" });
  },

  // Flujo de asignación
  async assign(
    paqueteId: string,
    rutaId: string,
    conductorId?: string
  ): ApiResponse<ApiResult> {
    const paqueteIndex = findEntityIndex(mockPaquetes, "id_paquete", paqueteId);
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (paqueteIndex === -1 || rutaIndex === -1) {
      return simulateRequest({
        success: false,
        message: "Paquete o ruta no encontrados",
      });
    }

    const paquete = mockPaquetes[paqueteIndex];
    const ruta = mockRutas[rutaIndex];

    // Validaciones
    const estadosAsignables = [
      PaquetesEstados.Pendiente,
      PaquetesEstados.Fallido,
    ];
    if (!estadosAsignables.includes(paquete.estado)) {
      return simulateRequest({
        success: false,
        message: "El paquete no se puede asignar en su estado actual",
      });
    }

    if (ruta.estado !== RutaEstado.Pendiente) {
      return simulateRequest({
        success: false,
        message: "La ruta no está disponible para asignaciones",
      });
    }

    // Buscar conductor disponible si no se especifica
    let conductor = conductorId
      ? mockConductores.find((c) => c.id_conductor === conductorId)
      : mockConductores.find((c) => c.estado === ConductorEstado.Disponible);

    if (!conductor) {
      return simulateRequest({
        success: false,
        message: "No hay conductores disponibles",
      });
    }

    if (conductor.estado === ConductorEstado.NoDisponible) {
      return simulateRequest({
        success: false,
        message: "El conductor seleccionado no está disponible",
      });
    }

    // Asignación
    if (!ruta.paquetes_asignados.includes(paqueteId)) {
      ruta.paquetes_asignados.push(paqueteId);
    }
    ruta.id_conductor_asignado = conductor.id_conductor;

    paquete.id_rutas_asignadas.push(rutaId);
    paquete.id_conductor_asignado = conductor.id_conductor;
    paquete.estado = PaquetesEstados.Asignado;

    return simulateRequest({
      success: true,
      message: "Paquete asignado exitosamente",
    });
  },

  async cancelAssignment(
    paqueteId: string,
    rutaId: string
  ): ApiResponse<ApiResult> {
    const paqueteIndex = findEntityIndex(mockPaquetes, "id_paquete", paqueteId);
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (paqueteIndex === -1 || rutaIndex === -1) {
      return simulateRequest({
        success: false,
        message: "Paquete o ruta no encontrados",
      });
    }

    const paquete = mockPaquetes[paqueteIndex];
    const ruta = mockRutas[rutaIndex];

    const estadosCancelables = [
      PaquetesEstados.Asignado,
      PaquetesEstados.EnRuta,
    ];
    if (!estadosCancelables.includes(paquete.estado)) {
      return simulateRequest({
        success: false,
        message: "No se puede cancelar la asignación en el estado actual",
      });
    }

    // Remover asignaciones
    paquete.id_rutas_asignadas = paquete.id_rutas_asignadas.filter(
      (r) => r !== rutaId
    );
    ruta.paquetes_asignados = ruta.paquetes_asignados.filter(
      (p) => p !== paqueteId
    );

    // Si el paquete no tiene más rutas asignadas, volver a pendiente
    if (paquete.id_rutas_asignadas.length === 0) {
      paquete.estado = PaquetesEstados.Pendiente;
      paquete.id_conductor_asignado = null;
    }

    return simulateRequest({ success: true, message: "Asignación cancelada" });
  },

  async reassign(
    paqueteId: string,
    nuevaRutaId: string,
    nuevoConductorId?: string,
    observacion?: string
  ): ApiResponse<ApiResult> {
    const paqueteIndex = findEntityIndex(mockPaquetes, "id_paquete", paqueteId);
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", nuevaRutaId);

    if (paqueteIndex === -1 || rutaIndex === -1) {
      return simulateRequest({
        success: false,
        message: "Paquete o ruta no encontrados",
      });
    }

    const paquete = mockPaquetes[paqueteIndex];
    const ruta = mockRutas[rutaIndex];

    if (paquete.estado !== PaquetesEstados.Fallido) {
      return simulateRequest({
        success: false,
        message: "Solo se pueden reasignar paquetes fallidos",
      });
    }

    if (ruta.estado !== RutaEstado.Pendiente) {
      return simulateRequest({
        success: false,
        message: "La ruta no está disponible",
      });
    }

    let conductor = nuevoConductorId
      ? mockConductores.find((c) => c.id_conductor === nuevoConductorId)
      : mockConductores.find((c) => c.estado === ConductorEstado.Disponible);

    if (!conductor) {
      return simulateRequest({
        success: false,
        message: "No hay conductores disponibles",
      });
    }

    // Reasignación
    paquete.id_rutas_asignadas.push(nuevaRutaId);
    paquete.id_conductor_asignado = conductor.id_conductor;
    paquete.estado = PaquetesEstados.Asignado;

    if (observacion) {
      paquete.observacion_conductor = observacion;
    }

    ruta.id_conductor_asignado = conductor.id_conductor;
    if (!ruta.paquetes_asignados.includes(paqueteId)) {
      ruta.paquetes_asignados.push(paqueteId);
    }

    return simulateRequest({
      success: true,
      message: "Paquete reasignado exitosamente",
    });
  },

  // Estados del flujo
  async markEnRuta(paqueteId: string): ApiResponse<ApiResult> {
    return paquetesAPI.updateEstado(paqueteId, PaquetesEstados.EnRuta);
  },

  async markEntregado(
    paqueteId: string,
    observacion?: string,
    imagen?: string
  ): ApiResponse<ApiResult> {
    const result = await paquetesAPI.updateEstado(
      paqueteId,
      PaquetesEstados.Entregado,
      {
        fecha_entrega: nowISO(),
        observacion_conductor: observacion,
        imagen_adjunta: imagen,
      }
    );
    return result;
  },

  async markFallido(
    paqueteId: string,
    observacion?: string
  ): ApiResponse<ApiResult> {
    return paquetesAPI.updateEstado(paqueteId, PaquetesEstados.Fallido, {
      observacion_conductor: observacion,
    });
  },

  // Helper para actualizar estado
  async updateEstado(
    paqueteId: string,
    nuevoEstado: PaquetesEstados,
    datosExtra: Partial<Paquete> = {}
  ): ApiResponse<ApiResult> {
    const index = findEntityIndex(mockPaquetes, "id_paquete", paqueteId);

    if (index === -1) {
      return simulateRequest({
        success: false,
        message: "Paquete no encontrado",
      });
    }

    mockPaquetes[index] = {
      ...mockPaquetes[index],
      estado: nuevoEstado,
      ...datosExtra,
    };

    return simulateRequest({ success: true, message: "Estado actualizado" });
  },
};

// ===================== API DE RUTAS =====================
const rutasAPI = {
  async getAll(): ApiResponse<Ruta[]> {
    return simulateRequest([...mockRutas]);
  },

  async getById(id: string): ApiResponse<Ruta | null> {
    const ruta = mockRutas.find((r) => r.id_ruta === id);
    return simulateRequest(ruta || null);
  },

  async getByEstado(estado: RutaEstado): ApiResponse<Ruta[]> {
    const rutas = mockRutas.filter((r) => r.estado === estado);
    return simulateRequest(rutas);
  },

  async getPendientes(): ApiResponse<Ruta[]> {
    return rutasAPI.getByEstado(RutaEstado.Pendiente);
  },

  async getDisponiblesParaReasignacion(paqueteId: string): ApiResponse<Ruta[]> {
    const rutasDisponibles = mockRutas.filter(
      (r) =>
        r.estado === RutaEstado.Pendiente &&
        !r.paquetes_asignados.includes(paqueteId)
    );
    return simulateRequest(rutasDisponibles);
  },

  async create(
    data: Omit<
      Ruta,
      | "id_ruta"
      | "fecha_registro"
      | "estado"
      | "paquetes_asignados"
      | "id_conductor_asignado"
    >
  ): ApiResponse<Ruta> {
    const nueva: Ruta = {
      ...data,
      id_ruta: generateId("RTA", mockRutas.at(-1), "id_ruta"),
      fecha_registro: nowISO(),
      estado: RutaEstado.Pendiente,
      paquetes_asignados: [],
      id_conductor_asignado: null,
    };

    mockRutas.push(nueva);
    return simulateRequest(nueva);
  },

  async update(id: string, data: Partial<Ruta>): ApiResponse<ApiResult> {
    const index = findEntityIndex(mockRutas, "id_ruta", id);

    if (index === -1) {
      return simulateRequest({ success: false, message: "Ruta no encontrada" });
    }

    mockRutas[index] = { ...mockRutas[index], ...data };
    return simulateRequest({ success: true, message: "Ruta actualizada" });
  },

  async delete(id: string): ApiResponse<ApiResult> {
    const index = findEntityIndex(mockRutas, "id_ruta", id);

    if (index === -1) {
      return simulateRequest({ success: false, message: "Ruta no encontrada" });
    }

    const ruta = mockRutas[index];
    if (ruta.estado !== RutaEstado.Pendiente) {
      return simulateRequest({
        success: false,
        message: "Solo se pueden eliminar rutas pendientes",
      });
    }

    mockRutas.splice(index, 1);
    return simulateRequest({ success: true, message: "Ruta eliminada" });
  },

  async assignConductor(
    rutaId: string,
    conductorId: string
  ): ApiResponse<ApiResult> {
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (rutaIndex === -1) {
      return simulateRequest({ success: false, message: "Ruta no encontrada" });
    }

    const ruta = mockRutas[rutaIndex];
    if (ruta.estado !== RutaEstado.Pendiente) {
      return simulateRequest({
        success: false,
        message: "La ruta no está disponible para asignación",
      });
    }

    const conductor = mockConductores.find(
      (c) => c.id_conductor === conductorId
    );
    if (!conductor) {
      return simulateRequest({
        success: false,
        message: "Conductor no encontrado",
      });
    }

    if (conductor.estado !== ConductorEstado.Disponible) {
      return simulateRequest({
        success: false,
        message: "El conductor no está disponible",
      });
    }

    // Asignación
    ruta.id_conductor_asignado = conductor.id_conductor;
    ruta.estado = RutaEstado.asignada;
    conductor.estado = ConductorEstado.EnRuta;

    return simulateRequest({
      success: true,
      message: "Conductor asignado a la ruta",
    });
  },

  async cancelAssignment(rutaId: string): ApiResponse<ApiResult> {
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (rutaIndex === -1) {
      return simulateRequest({ success: false, message: "Ruta no encontrada" });
    }

    const ruta = mockRutas[rutaIndex];
    if (ruta.estado !== RutaEstado.asignada) {
      return simulateRequest({
        success: false,
        message: "La ruta no está asignada",
      });
    }

    // Liberar conductor
    if (ruta.id_conductor_asignado) {
      const conductor = mockConductores.find(
        (c) => c.id_conductor === ruta.id_conductor_asignado
      );
      if (conductor) {
        conductor.estado = ConductorEstado.Disponible;
      }
      ruta.id_conductor_asignado = null;
    }

    ruta.estado = RutaEstado.Pendiente;

    return simulateRequest({ success: true, message: "Asignación cancelada" });
  },

  async complete(rutaId: string): ApiResponse<ApiResult> {
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (rutaIndex === -1) {
      return simulateRequest({ success: false, message: "Ruta no encontrada" });
    }

    const ruta = mockRutas[rutaIndex];
    if (ruta.estado !== RutaEstado.asignada) {
      return simulateRequest({
        success: false,
        message: "La ruta no se puede completar en su estado actual",
      });
    }

    ruta.estado = RutaEstado.Completada;

    // Liberar conductor
    if (ruta.id_conductor_asignado) {
      const conductor = mockConductores.find(
        (c) => c.id_conductor === ruta.id_conductor_asignado
      );
      if (conductor) {
        conductor.estado = ConductorEstado.Disponible;
      }
    }

    return simulateRequest({ success: true, message: "Ruta completada" });
  },

  async markFallida(rutaId: string): ApiResponse<ApiResult> {
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (rutaIndex === -1) {
      return simulateRequest({ success: false, message: "Ruta no encontrada" });
    }

    const ruta = mockRutas[rutaIndex];
    ruta.estado = RutaEstado.Fallida;

    // Liberar conductor pero mantener la asignación para historial
    if (ruta.id_conductor_asignado) {
      const conductor = mockConductores.find(
        (c) => c.id_conductor === ruta.id_conductor_asignado
      );
      if (conductor) {
        conductor.estado = ConductorEstado.Disponible;
      }
    }

    return simulateRequest({
      success: true,
      message: "Ruta marcada como fallida",
    });
  },
};

// ===================== API DE CONDUCTORES =====================
const conductoresAPI = {
  async getAll(): ApiResponse<Conductor[]> {
    return simulateRequest([...mockConductores]);
  },

  async getById(
    id: string
  ): ApiResponse<(Conductor & { vehiculo?: Vehiculo }) | null> {
    const conductor = mockConductores.find((c) => c.id_conductor === id);

    if (!conductor) {
      return simulateRequest(null);
    }

    const vehiculo = conductor.id_vehiculo_asignado
      ? mockVehiculos.find(
          (v) => v.id_vehiculo === conductor.id_vehiculo_asignado
        )
      : undefined;

    return simulateRequest({
      ...conductor,
      vehiculo,
    });
  },

  async getByEstado(estado: ConductorEstado): ApiResponse<Conductor[]> {
    const conductores = mockConductores.filter((c) => c.estado === estado);
    return simulateRequest(conductores);
  },

  async getDisponibles(): ApiResponse<Conductor[]> {
    return conductoresAPI.getByEstado(ConductorEstado.Disponible);
  },

  async updateEstado(
    id: string,
    nuevoEstado: ConductorEstado
  ): ApiResponse<ApiResult> {
    const conductor = mockConductores.find((c) => c.id_conductor === id);

    if (!conductor) {
      return simulateRequest({
        success: false,
        message: "Conductor no encontrado",
      });
    }

    conductor.estado = nuevoEstado;
    return simulateRequest({
      success: true,
      message: "Estado del conductor actualizado",
    });
  },

  async assignRuta(
    conductorId: string,
    rutaId: string
  ): ApiResponse<ApiResult> {
    const conductor = mockConductores.find(
      (c) => c.id_conductor === conductorId
    );
    const ruta = mockRutas.find((r) => r.id_ruta === rutaId);

    if (!conductor) {
      return simulateRequest({
        success: false,
        message: "Conductor no encontrado",
      });
    }

    if (!ruta) {
      return simulateRequest({ success: false, message: "Ruta no encontrada" });
    }

    if (conductor.estado !== ConductorEstado.Disponible) {
      return simulateRequest({
        success: false,
        message: "El conductor no está disponible",
      });
    }

    if (ruta.estado !== RutaEstado.Pendiente) {
      return simulateRequest({
        success: false,
        message: "La ruta no está disponible",
      });
    }

    // Asignación
    ruta.id_conductor_asignado = conductor.id_conductor;
    ruta.estado = RutaEstado.asignada;
    conductor.estado = ConductorEstado.EnRuta;

    // Actualizar paquetes de la ruta
    ruta.paquetes_asignados.forEach((paqueteId) => {
      const paquete = mockPaquetes.find((p) => p.id_paquete === paqueteId);
      if (paquete) {
        paquete.id_conductor_asignado = conductor.id_conductor;
        if (paquete.estado === PaquetesEstados.Pendiente) {
          paquete.estado = PaquetesEstados.Asignado;
        }
      }
    });

    return simulateRequest({
      success: true,
      message: "Ruta asignada al conductor",
    });
  },
};

// ===================== API DE VEHÍCULOS =====================
const vehiculosAPI = {
  async getAll(): ApiResponse<Vehiculo[]> {
    return simulateRequest([...mockVehiculos]);
  },

  async getById(id: string): ApiResponse<Vehiculo | null> {
    const vehiculo = mockVehiculos.find((v) => v.id_vehiculo === id);
    return simulateRequest(vehiculo || null);
  },

  async getByEstado(estado: VehiculoEstado): ApiResponse<Vehiculo[]> {
    const vehiculos = mockVehiculos.filter((v) => v.estado === estado);
    return simulateRequest(vehiculos);
  },

  async getDisponibles(): ApiResponse<Vehiculo[]> {
    return vehiculosAPI.getByEstado(VehiculoEstado.Disponible);
  },

  async create(data: Omit<Vehiculo, "id_vehiculo">): ApiResponse<Vehiculo> {
    const nuevo: Vehiculo = {
      ...data,
      id_vehiculo: generateId("VEH", mockVehiculos.at(-1), "id_vehiculo"),
    };

    mockVehiculos.push(nuevo);
    return simulateRequest(nuevo);
  },

  async update(id: string, data: Partial<Vehiculo>): ApiResponse<ApiResult> {
    const index = findEntityIndex(mockVehiculos, "id_vehiculo", id);

    if (index === -1) {
      return simulateRequest({
        success: false,
        message: "Vehículo no encontrado",
      });
    }

    mockVehiculos[index] = { ...mockVehiculos[index], ...data };
    return simulateRequest({ success: true, message: "Vehículo actualizado" });
  },

  async delete(id: string): ApiResponse<ApiResult> {
    const index = findEntityIndex(mockVehiculos, "id_vehiculo", id);

    if (index === -1) {
      return simulateRequest({
        success: false,
        message: "Vehículo no encontrado",
      });
    }

    const vehiculo = mockVehiculos[index];
    if (vehiculo.estado !== VehiculoEstado.Disponible) {
      return simulateRequest({
        success: false,
        message: "Solo se pueden eliminar vehículos disponibles",
      });
    }

    // Verificar que no esté asignado a ningún conductor
    const conductorAsignado = mockConductores.find(
      (c) => c.id_vehiculo_asignado === id
    );

    if (conductorAsignado) {
      return simulateRequest({
        success: false,
        message: "No se puede eliminar un vehículo asignado a un conductor",
      });
    }

    mockVehiculos.splice(index, 1);
    return simulateRequest({ success: true, message: "Vehículo eliminado" });
  },

  async assignToConductor(
    vehiculoId: string,
    conductorId: string
  ): ApiResponse<ApiResult> {
    const vehiculo = mockVehiculos.find((v) => v.id_vehiculo === vehiculoId);
    const conductor = mockConductores.find(
      (c) => c.id_conductor === conductorId
    );

    if (!vehiculo) {
      return simulateRequest({
        success: false,
        message: "Vehículo no encontrado",
      });
    }

    if (!conductor) {
      return simulateRequest({
        success: false,
        message: "Conductor no encontrado",
      });
    }

    if (vehiculo.estado !== VehiculoEstado.Disponible) {
      return simulateRequest({
        success: false,
        message: "El vehículo no está disponible",
      });
    }

    if (conductor.id_vehiculo_asignado) {
      return simulateRequest({
        success: false,
        message: "El conductor ya tiene un vehículo asignado",
      });
    }

    // Asignación
    conductor.id_vehiculo_asignado = vehiculo.id_vehiculo;
    vehiculo.estado = VehiculoEstado.NoDisponible;

    return simulateRequest({
      success: true,
      message: "Vehículo asignado al conductor",
    });
  },

  async unassignFromConductor(vehiculoId: string): ApiResponse<ApiResult> {
    const vehiculo = mockVehiculos.find((v) => v.id_vehiculo === vehiculoId);

    if (!vehiculo) {
      return simulateRequest({
        success: false,
        message: "Vehículo no encontrado",
      });
    }

    // Buscar el conductor que tiene asignado este vehículo
    const conductor = mockConductores.find(
      (c) => c.id_vehiculo_asignado === vehiculoId
    );

    if (!conductor) {
      return simulateRequest({
        success: false,
        message: "El vehículo no está asignado a ningún conductor",
      });
    }

    // Solo se puede desasignar si el conductor no está en ruta
    if (conductor.estado === ConductorEstado.EnRuta) {
      return simulateRequest({
        success: false,
        message: "No se puede desasignar un vehículo de un conductor en ruta",
      });
    }

    // Desasignación
    conductor.id_vehiculo_asignado = undefined;
    vehiculo.estado = VehiculoEstado.Disponible;

    return simulateRequest({
      success: true,
      message: "Vehículo desasignado del conductor",
    });
  },
};

// ===================== EXPORTACIÓN PRINCIPAL =====================
export const api = {
  paquetes: paquetesAPI,
  rutas: rutasAPI,
  conductores: conductoresAPI,
  vehiculos: vehiculosAPI,
};

// Exportar también APIs individuales para casos específicos
export { paquetesAPI, rutasAPI, conductoresAPI, vehiculosAPI };

// Exportar tipos para uso externo
export type { ApiResponse, ApiResult };
