/*const ENV_PATH = import.meta.env;

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

// Nueva interfaz estandarizada para todas las respuestas de mutaciones
interface ApiResult<T> {
  entidadPrincipal: T;
  entidadesRelacionadas?: {
    ruta?: Ruta;
    conductor?: Conductor;
    vehiculo?: Vehiculo;
    paquetes?: Paquete[];
  };
  mensaje: string;
}

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
  ): ApiResponse<ApiResult<Ruta>> {
    const nueva: Ruta = {
      ...data,
      id_ruta: generateId("RTA", mockRutas.at(-1), "id_ruta"),
      fecha_registro: nowISO(),
      estado: RutaEstado.Pendiente,
      paquetes_asignados: [],
      id_conductor_asignado: null,
    };

    mockRutas.push(nueva);
    return simulateRequest({
      entidadPrincipal: nueva,
      mensaje: "Ruta creada exitosamente",
    });
  },

  async update(id: string, data: Partial<Ruta>): ApiResponse<ApiResult<Ruta>> {
    const index = findEntityIndex(mockRutas, "id_ruta", id);

    if (index === -1) {
      throw new Error("Ruta no encontrada");
    }

    const rutaOriginal = mockRutas[index];
    const rutaActualizada = {
      ...rutaOriginal,
      ...data,
      fecha_actualizacion: nowISO(), // Campo que el servidor podría agregar
    };

    mockRutas[index] = rutaActualizada;
    return simulateRequest({
      entidadPrincipal: rutaActualizada,
      mensaje: "Ruta actualizada exitosamente",
    });
  },

  async delete(id: string): ApiResponse<ApiResult<string>> {
    const index = findEntityIndex(mockRutas, "id_ruta", id);

    if (index === -1) {
      throw new Error("Ruta no encontrada");
    }

    const ruta = mockRutas[index];
    if (ruta.estado !== RutaEstado.Pendiente) {
      throw new Error("Solo se pueden eliminar rutas pendientes");
    }

    mockRutas.splice(index, 1);
    return simulateRequest({
      entidadPrincipal: id,
      mensaje: "Ruta eliminada exitosamente",
    });
  },

  async assignConductor(
    rutaId: string,
    conductorId: string
  ): ApiResponse<ApiResult<Ruta>> {
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (rutaIndex === -1) {
      throw new Error("Ruta no encontrada");
    }

    const rutaOriginal = mockRutas[rutaIndex];
    if (rutaOriginal.estado !== RutaEstado.Pendiente) {
      throw new Error("La ruta no está disponible para asignación");
    }

    const conductor = mockConductores.find(
      (c) => c.id_conductor === conductorId
    );
    if (!conductor) {
      throw new Error("Conductor no encontrado");
    }

    if (conductor.estado !== ConductorEstado.Disponible) {
      throw new Error("El conductor no está disponible");
    }

    // Asignación - el "servidor" decide los valores finales
    const rutaActualizada = {
      ...rutaOriginal,
      id_conductor_asignado: conductor.id_conductor,
      estado: RutaEstado.Asignada,
      fecha_asignacion: nowISO(), // Campo que el servidor podría agregar
    };

    const conductorActualizado = {
      ...conductor,
      estado: ConductorEstado.EnRuta,
    };

    // Actualizar mocks
    mockRutas[rutaIndex] = rutaActualizada;
    const conductorIndex = findEntityIndex(mockConductores, "id_conductor", conductorId);
    mockConductores[conductorIndex] = conductorActualizado;

    return simulateRequest({
      entidadPrincipal: rutaActualizada,
      entidadesRelacionadas: {
        conductor: conductorActualizado,
      },
      mensaje: "Conductor asignado a la ruta exitosamente",
    });
  },

  async cancelAssignment(rutaId: string): ApiResponse<ApiResult<Ruta>> {
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (rutaIndex === -1) {
      throw new Error("Ruta no encontrada");
    }

    const rutaOriginal = mockRutas[rutaIndex];
    if (rutaOriginal.estado !== RutaEstado.Asignada) {
      throw new Error("La ruta no está asignada");
    }

    // Liberar conductor
    let conductorActualizado: Conductor | undefined;
    if (rutaOriginal.id_conductor_asignado) {
      const conductorIndex = findEntityIndex(mockConductores, "id_conductor", rutaOriginal.id_conductor_asignado);
      if (conductorIndex !== -1) {
        const conductor = mockConductores[conductorIndex];
        conductorActualizado = {
          ...conductor,
          estado: ConductorEstado.Disponible,
        };
        mockConductores[conductorIndex] = conductorActualizado;
      }
    }

    const rutaActualizada = {
      ...rutaOriginal,
      id_conductor_asignado: null,
      estado: RutaEstado.Pendiente,
      fecha_cancelacion: nowISO(), // Campo que el servidor podría agregar
    };

    mockRutas[rutaIndex] = rutaActualizada;

    return simulateRequest({
      entidadPrincipal: rutaActualizada,
      entidadesRelacionadas: {
        conductor: conductorActualizado,
      },
      mensaje: "Asignación cancelada exitosamente",
    });
  },

  async complete(rutaId: string): ApiResponse<ApiResult<Ruta>> {
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (rutaIndex === -1) {
      throw new Error("Ruta no encontrada");
    }

    const rutaOriginal = mockRutas[rutaIndex];
    if (rutaOriginal.estado !== RutaEstado.Asignada) {
      throw new Error("La ruta no se puede completar en su estado actual");
    }

    // Liberar conductor
    let conductorActualizado: Conductor | undefined;
    if (rutaOriginal.id_conductor_asignado) {
      const conductorIndex = findEntityIndex(mockConductores, "id_conductor", rutaOriginal.id_conductor_asignado);
      if (conductorIndex !== -1) {
        const conductor = mockConductores[conductorIndex];
        conductorActualizado = {
          ...conductor,
          estado: ConductorEstado.Disponible,
        };
        mockConductores[conductorIndex] = conductorActualizado;
      }
    }

    const rutaActualizada = {
      ...rutaOriginal,
      estado: RutaEstado.Completada,
      fecha_completacion: nowISO(), // Campo que el servidor podría agregar
    };

    mockRutas[rutaIndex] = rutaActualizada;

    return simulateRequest({
      entidadPrincipal: rutaActualizada,
      mensaje: "Ruta completada exitosamente",
    });
  },

  async markFallida(rutaId: string): ApiResponse<ApiResult<Ruta>> {
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (rutaIndex === -1) {
      throw new Error("Ruta no encontrada");
    }

    const rutaOriginal = mockRutas[rutaIndex];

    // Liberar conductor pero mantener la asignación para historial
    let conductorActualizado: Conductor | undefined;
    if (rutaOriginal.id_conductor_asignado) {
      const conductorIndex = findEntityIndex(mockConductores, "id_conductor", rutaOriginal.id_conductor_asignado);
      if (conductorIndex !== -1) {
        const conductor = mockConductores[conductorIndex];
        conductorActualizado = {
          ...conductor,
          estado: ConductorEstado.Disponible,
        };
        mockConductores[conductorIndex] = conductorActualizado;
      }
    }

    const rutaActualizada = {
      ...rutaOriginal,
      estado: RutaEstado.Fallida,
      fecha_fallida: nowISO(), // Campo que el servidor podría agregar
    };

    mockRutas[rutaIndex] = rutaActualizada;

    return simulateRequest({
      entidadPrincipal: rutaActualizada,
      mensaje: "Ruta marcada como fallida exitosamente",
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
  ): ApiResponse<ApiResult<Conductor>> {
    const index = findEntityIndex(mockConductores, "id_conductor", id);

    if (index === -1) {
      throw new Error("Conductor no encontrado");
    }

    const conductorOriginal = mockConductores[index];
    const conductorActualizado = {
      ...conductorOriginal,
      estado: nuevoEstado,
      fecha_actualizacion: nowISO(), // Campo que el servidor podría agregar
    };

    mockConductores[index] = conductorActualizado;

    return simulateRequest({
      entidadPrincipal: conductorActualizado,
      mensaje: "Estado del conductor actualizado exitosamente",
    });
  },

  async assignRuta(
    conductorId: string,
    rutaId: string
  ): ApiResponse<ApiResult<Conductor>> {
    const conductorIndex = findEntityIndex(mockConductores, "id_conductor", conductorId);
    const rutaIndex = findEntityIndex(mockRutas, "id_ruta", rutaId);

    if (conductorIndex === -1) {
      throw new Error("Conductor no encontrado");
    }

    if (rutaIndex === -1) {
      throw new Error("Ruta no encontrada");
    }

    const conductorOriginal = mockConductores[conductorIndex];
    const rutaOriginal = mockRutas[rutaIndex];

    if (conductorOriginal.estado !== ConductorEstado.Disponible) {
      throw new Error("El conductor no está disponible");
    }

    if (rutaOriginal.estado !== RutaEstado.Pendiente) {
      throw new Error("La ruta no está disponible");
    }

    // Asignación - el "servidor" decide los valores finales
    const rutaActualizada = {
      ...rutaOriginal,
      id_conductor_asignado: conductorOriginal.id_conductor,
      estado: RutaEstado.Asignada,
      fecha_asignacion: nowISO(), // Campo que el servidor podría agregar
    };

    const conductorActualizado = {
      ...conductorOriginal,
      estado: ConductorEstado.EnRuta,
    };

    // Actualizar paquetes de la ruta
    const paquetesActualizados: Paquete[] = [];

for (const paqueteId of rutaOriginal.paquetes_asignados) {
  try {
    // 1. Obtiene el paquete desde tu API real
    const res = await fetch(`http://localhost:3000/paquetes/${paqueteId}`);
    if (!res.ok) throw new Error("Error al obtener paquete");
    const paquete: Paquete = await res.json();

    // 2. Prepara el objeto actualizado
    const paqueteActualizado: Paquete = {
      ...paquete,
      id_conductor_asignado: conductorOriginal.id_conductor,
      estado:
        paquete.estado === PaquetesEstados.Pendiente
          ? PaquetesEstados.Asignado
          : paquete.estado,
    };

    // 3. Llama a la API para guardar cambios
    const updateRes = await fetch(
      `http://localhost:3000/paquetes/${paqueteId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paqueteActualizado),
      }
    );
    if (!updateRes.ok) throw new Error("Error al actualizar paquete");

    const actualizado: Paquete = await updateRes.json();
    paquetesActualizados.push(actualizado);
  } catch (err) {
    console.error(`No se pudo actualizar el paquete ${paqueteId}`, err);
  }
}


    // Actualizar mocks
    mockConductores[conductorIndex] = conductorActualizado;
    mockRutas[rutaIndex] = rutaActualizada;

    return simulateRequest({
      entidadPrincipal: conductorActualizado,
      entidadesRelacionadas: {
        ruta: rutaActualizada,
        paquetes: paquetesActualizados,
      },
      mensaje: "Ruta asignada al conductor exitosamente",
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

  async create(data: Omit<Vehiculo, "id_vehiculo">): ApiResponse<ApiResult<Vehiculo>> {
    const nuevo: Vehiculo = {
      ...data,
      id_vehiculo: generateId("VEH", mockVehiculos.at(-1), "id_vehiculo"),
    };

    mockVehiculos.push(nuevo);
    return simulateRequest({
      entidadPrincipal: nuevo,
      mensaje: "Vehículo creado exitosamente",
    });
  },

  async update(id: string, data: Partial<Vehiculo>): ApiResponse<ApiResult<Vehiculo>> {
    const index = findEntityIndex(mockVehiculos, "id_vehiculo", id);

    if (index === -1) {
      throw new Error("Vehículo no encontrado");
    }

    const vehiculoOriginal = mockVehiculos[index];
    const vehiculoActualizado = {
      ...vehiculoOriginal,
      ...data,
      fecha_actualizacion: nowISO(), // Campo que el servidor podría agregar
    };

    mockVehiculos[index] = vehiculoActualizado;
    return simulateRequest({
      entidadPrincipal: vehiculoActualizado,
      mensaje: "Vehículo actualizado exitosamente",
    });
  },

  async delete(id: string): ApiResponse<ApiResult<string>> {
    const index = findEntityIndex(mockVehiculos, "id_vehiculo", id);

    if (index === -1) {
      throw new Error("Vehículo no encontrado");
    }

    const vehiculo = mockVehiculos[index];
    if (vehiculo.estado !== VehiculoEstado.Disponible) {
      throw new Error("Solo se pueden eliminar vehículos disponibles");
    }

    // Verificar que no esté asignado a ningún conductor
    const conductorAsignado = mockConductores.find(
      (c) => c.id_vehiculo_asignado === id
    );

    if (conductorAsignado) {
      throw new Error("No se puede eliminar un vehículo asignado a un conductor");
    }

    mockVehiculos.splice(index, 1);
    return simulateRequest({
      entidadPrincipal: id,
      mensaje: "Vehículo eliminado exitosamente",
    });
  },

  async assignToConductor(
    vehiculoId: string,
    conductorId: string
  ): ApiResponse<ApiResult<Vehiculo>> {
    const vehiculoIndex = findEntityIndex(mockVehiculos, "id_vehiculo", vehiculoId);
    const conductorIndex = findEntityIndex(mockConductores, "id_conductor", conductorId);

    if (vehiculoIndex === -1) {
      throw new Error("Vehículo no encontrado");
    }

    if (conductorIndex === -1) {
      throw new Error("Conductor no encontrado");
    }

    const vehiculoOriginal = mockVehiculos[vehiculoIndex];
    const conductorOriginal = mockConductores[conductorIndex];

    if (vehiculoOriginal.estado !== VehiculoEstado.Disponible) {
      throw new Error("El vehículo no está disponible");
    }

    if (conductorOriginal.id_vehiculo_asignado) {
      throw new Error("El conductor ya tiene un vehículo asignado");
    }

    // Asignación - el "servidor" decide los valores finales
    const conductorActualizado = {
      ...conductorOriginal,
      id_vehiculo_asignado: vehiculoOriginal.id_vehiculo,
      fecha_asignacion: nowISO(), // Campo que el servidor podría agregar
    };

    const vehiculoActualizado = {
      ...vehiculoOriginal,
      estado: VehiculoEstado.NoDisponible,
    };

    // Actualizar mocks
    mockConductores[conductorIndex] = conductorActualizado;
    mockVehiculos[vehiculoIndex] = vehiculoActualizado;

    return simulateRequest({
      entidadPrincipal: vehiculoActualizado,
      entidadesRelacionadas: {
        conductor: conductorActualizado,
      },
      mensaje: "Vehículo asignado al conductor exitosamente",
    });
  },

  async unassignFromConductor(vehiculoId: string): ApiResponse<ApiResult<Vehiculo>> {
    const vehiculoIndex = findEntityIndex(mockVehiculos, "id_vehiculo", vehiculoId);

    if (vehiculoIndex === -1) {
      throw new Error("Vehículo no encontrado");
    }

    const vehiculoOriginal = mockVehiculos[vehiculoIndex];

    // Buscar el conductor que tiene asignado este vehículo
    const conductorIndex = mockConductores.findIndex(
      (c) => c.id_vehiculo_asignado === vehiculoId
    );

    if (conductorIndex === -1) {
      throw new Error("El vehículo no está asignado a ningún conductor");
    }

    const conductorOriginal = mockConductores[conductorIndex];

    // Solo se puede desasignar si el conductor no está en ruta
    if (conductorOriginal.estado === ConductorEstado.EnRuta) {
      throw new Error("No se puede desasignar un vehículo de un conductor en ruta");
    }

    // Desasignación - el "servidor" decide los valores finales
    const conductorActualizado = {
      ...conductorOriginal,
      id_vehiculo_asignado: undefined,
      fecha_desasignacion: nowISO(), // Campo que el servidor podría agregar
    };

    const vehiculoActualizado = {
      ...vehiculoOriginal,
      estado: VehiculoEstado.Disponible,
    };

    // Actualizar mocks
    mockConductores[conductorIndex] = conductorActualizado;
    mockVehiculos[vehiculoIndex] = vehiculoActualizado;

    return simulateRequest({
      entidadPrincipal: vehiculoActualizado,
      entidadesRelacionadas: {
        conductor: conductorActualizado,
      },
      mensaje: "Vehículo desasignado del conductor exitosamente",
    });
  },
};


// ===================== EXPORTACIÓN PRINCIPAL =====================
export const api = {
  rutas: rutasAPI,
  conductores: conductoresAPI,
  vehiculos: vehiculosAPI,
};

// Exportar también APIs individuales para casos específicos
export {rutasAPI, conductoresAPI, vehiculosAPI };*/
