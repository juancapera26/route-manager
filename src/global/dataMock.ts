// src/global/dataMock.ts

// Esto dejalo intacto
function generarUltimos7Dias() {
  const hoy = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - (6 - i));
    return fecha.toISOString().split("T")[0]; // YYYY-MM-DD
  });
}

// Generar últimos 2 meses dinámicamente - Esto dejalo intacto
function generarUltimos2Meses() {
  const hoy = new Date();
  return Array.from({ length: 2 }).map((_, i) => {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - (1 - i), 1);
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    return `${año}-${mes}`;
  });
}

const ultimos7Dias = generarUltimos7Dias();
const ultimos2Meses = generarUltimos2Meses();

// --- Paquetes --- Dejalo intacto
export const paquetesPorSemana = ultimos7Dias.map((fecha) => {
  const activos = Math.floor(40 + Math.random() * 20); // 40-60
  const inactivos = Math.floor(5 + Math.random() * 10); // 5-15
  return { fecha, activos, inactivos, total: activos + inactivos };
});

// --- Rutas --- Dejalo intacto
export const rutasPorSemana = ultimos7Dias.map((fecha) => {
  const activas = Math.floor(10 + Math.random() * 8); // 10-18
  const inactivas = Math.floor(1 + Math.random() * 4); // 1-5
  return { fecha, activas, inactivas, total: activas + inactivas };
});

// --- Conductores (CORREGIDO: ahora genera datos para todos los días) --- Dejalo intacto
export const conductoresPorSemana = ultimos7Dias.map((fecha) => {
  const disponibles = Math.floor(8 + Math.random() * 5); // 8-12
  const noDisponibles = Math.floor(1 + Math.random() * 3); // 1-4
  return {
    fecha,
    disponibles,
    noDisponibles,
    total: disponibles + noDisponibles,
  };
});

// --- Entregas promedio por mes (CORREGIDO: solo últimos 2 meses) --- Dejalo intacto
export const tiemposEntregaMensuales = ultimos2Meses.map((mes) => ({
  mes,
  minutosPromedioEntrega: Math.floor(35 + Math.random() * 25), // 35-60 minutos
}));

// ====== ESTRUCTURAS DE DATOS PARA CARDS 4 Y 6 ======

// --- Card 4: Estado Actual de Paquetes ---
export const estadoActualPaquetes = {
  asignados: Math.floor(25 + Math.random() * 15), // 25-40 paquetes asignados
  entregados: Math.floor(180 + Math.random() * 40), // 180-220 paquetes entregados
  pendientes: Math.floor(8 + Math.random() * 12), // 8-20 paquetes pendientes
  fallidos: Math.floor(2 + Math.random() * 6), // 2-8 paquetes fallidos
};

// --- Card 6: Datos para Panorama Operativo de Rutas ---

// Estado actual de rutas del día
export const estadoActualRutas = {
  asignadas: Math.floor(8 + Math.random() * 6), // 8-14 rutas asignadas
  completadas: Math.floor(12 + Math.random() * 8), // 12-20 rutas completadas
  pendientes: Math.floor(3 + Math.random() * 5), // 3-8 rutas pendientes
  fallidas: Math.floor(0 + Math.random() * 3), // 0-3 rutas fallidas
};

// Métricas operativas diarias calculadas dinámicamente
export const metricasOperativasDiarias = {
  // Calcula el porcentaje de entregas exitosas basado en los datos actuales
  porcentajeEntregasExitosas: Math.round(
    (estadoActualPaquetes.entregados /
      (estadoActualPaquetes.entregados + estadoActualPaquetes.fallidos)) *
      100
  ),

  // Datos adicionales para futuras métricas
  totalPaquetesDelDia: Object.values(estadoActualPaquetes).reduce(
    (a, b) => a + b,
    0
  ),
  totalRutasDelDia: Object.values(estadoActualRutas).reduce((a, b) => a + b, 0),
};

// --- Configuración de colores ---

// Configuración de colores para los gráficos (consistente con el tema)
export const coloresGraficos = {
  paquetes: {
    asignados: "#465FFF", // Azul claro - PRIMERO
    entregados: "#12B76A", // Verde - SEGUNDO
    pendientes: "#FD853A", // Naranja - TERCERO
    fallidos: "#F04438", // Rojo - CUARTO
  },
  rutas: {
    asignadas: "#465FFF", // Azul principal - PRIMERO
    completadas: "#12B76A", // Verde - SEGUNDO
    pendientes: "#FD853A", // Naranja - TERCERO
    fallidas: "#F04438", // Rojo - CUARTO
  },
};

// Etiquetas en español para los gráficos
export const etiquetasEstados = {
  paquetes: {
    asignados: "Asignados", // PRIMERO
    entregados: "Entregados", // SEGUNDO
    pendientes: "Pendientes", // TERCERO
    fallidos: "Fallidos", // CUARTO
  },
  rutas: {
    asignadas: "Asignadas", // PRIMERO
    completadas: "Completadas", // SEGUNDO
    pendientes: "Pendientes", // TERCERO
    fallidas: "Fallidas", // CUARTO
  },
};

// ====== ESTRUCTURAS DE DATOS PARA NOTIFICACIONES ======

// Tipos de notificaciones disponibles
export type TipoNotificacion =
  | "informacion"
  | "error"
  | "advertencia"
  | "completado";

// Títulos fijos disponibles
export type TituloNotificacion =
  | "Entrega retrasada"
  | "Fallo en entrega"
  | "Mantenimiento necesario"
  | "Ruta completada"
  | "Nuevo paquete registrado";

// Interfaz para una notificación
export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  titulo: TituloNotificacion;
  descripcion: string;
  fechaCreacion: string; // ISO string
  leida: boolean;
  // Campos adicionales para futuro backend
  conductorId?: string;
  paqueteId?: string;
  rutaId?: string;
}

// Configuración de estilos por tipo de notificación
export const estilosNotificacion = {
  informacion: {
    bgIcon: "bg-blue-100 dark:bg-blue-900/20",
    textIcon: "text-blue-600 dark:text-blue-400",
    bgBadge: "bg-blue-50 dark:bg-blue-900/20",
    textBadge: "text-blue-700 dark:text-blue-400",
    icon: "info",
  },
  error: {
    bgIcon: "bg-red-100 dark:bg-red-900/20",
    textIcon: "text-red-600 dark:text-red-400",
    bgBadge: "bg-red-50 dark:bg-red-900/20",
    textBadge: "text-red-700 dark:text-red-400",
    icon: "error",
  },
  advertencia: {
    bgIcon: "bg-orange-100 dark:bg-orange-900/20",
    textIcon: "text-orange-600 dark:text-orange-400",
    bgBadge: "bg-orange-50 dark:bg-orange-900/20",
    textBadge: "text-orange-700 dark:text-orange-400",
    icon: "warning",
  },
  completado: {
    bgIcon: "bg-success-100 dark:bg-success-900/20",
    textIcon: "text-success-600 dark:text-success-400",
    bgBadge: "bg-success-50 dark:bg-success-900/20",
    textBadge: "text-success-700 dark:text-success-400",
    icon: "success",
  },
};

// Función para generar descripción dinámica (simulando backend)
function generarDescripcion(titulo: TituloNotificacion): string {
  const descripciones = {
    "Entrega retrasada":
      "El paquete #PKG-2024-001 tiene un retraso de 15 minutos en su entrega",
    "Fallo en entrega":
      "No se pudo completar la entrega del paquete #PKG-2024-002 - destinatario estaba ausente",
    "Mantenimiento necesario": "El vehículo ABC-123 necesita un mantenimiento",
    "Ruta completada":
      "La ruta Norte-01 ha sido completada exitosamente por Johann Gómez",
    "Nuevo paquete registrado":
      "Se ha registrado un nuevo paquete #PKG-2024-005 para entrega urgente",
  };
  return descripciones[titulo];
}

// Función para generar fecha aleatoria de los últimos días
function generarFechaReciente(): string {
  const ahora = new Date();
  const horasAtras = Math.floor(Math.random() * 24); // Últimas 24 horas
  const fecha = new Date(ahora.getTime() - horasAtras * 60 * 60 * 1000);
  return fecha.toISOString();
}

// Datos mock de notificaciones (simula respuesta del backend)
export const notificacionesMock: Notificacion[] = [
  {
    id: "notif-001",
    tipo: "advertencia",
    titulo: "Entrega retrasada",
    descripcion: generarDescripcion("Entrega retrasada"),
    fechaCreacion: generarFechaReciente(),
    leida: false,
    paqueteId: "PKG-2024-001",
    conductorId: "COND-001",
  },
  {
    id: "notif-002",
    tipo: "error",
    titulo: "Fallo en entrega",
    descripcion: generarDescripcion("Fallo en entrega"),
    fechaCreacion: generarFechaReciente(),
    leida: false,
    paqueteId: "PKG-2024-002",
    conductorId: "COND-002",
  },
  {
    id: "notif-003",
    tipo: "completado",
    titulo: "Ruta completada",
    descripcion: generarDescripcion("Ruta completada"),
    fechaCreacion: generarFechaReciente(),
    leida: true,
    rutaId: "R-Norte-01",
    conductorId: "COND-003",
  },
  {
    id: "notif-004",
    tipo: "informacion",
    titulo: "Nuevo paquete registrado",
    descripcion: generarDescripcion("Nuevo paquete registrado"),
    fechaCreacion: generarFechaReciente(),
    leida: false,
    paqueteId: "PKG-2024-005",
  },
  {
    id: "notif-005",
    tipo: "advertencia",
    titulo: "Mantenimiento necesario",
    descripcion: generarDescripcion("Mantenimiento necesario"),
    fechaCreacion: generarFechaReciente(),
    leida: true,
    conductorId: "COND-001",
  },
];

// Función auxiliar para obtener notificaciones no leídas
export const obtenerNotificacionesNoLeidas = () =>
  notificacionesMock.filter((notif) => !notif.leida);

// Función auxiliar para contar notificaciones no leídas
export const contarNotificacionesNoLeidas = () =>
  obtenerNotificacionesNoLeidas().length;
















// ------ TIPADOS Modulos ------

// Paquetes
// =====================
export interface Destinatario {
  nombre: string;
  apellido: string;
  direccion: string;
  correo: string;
  telefono: string;
}

export interface PaquetesDimensiones {
  largo: number; // cm
  ancho: number; // cm
  alto: number; // cm
  peso: number; // kg
}

export enum PaquetesEstados {
  Pendiente = "Pendiente",
  Asignado = "Asignado",
  EnRuta = "En ruta",
  Entregado = "Entregado",
  Fallido = "Fallido",
}

export enum TipoPaquete {
  Grande = "Grande",
  Mediano = "Mediano",
  Pequeño = "Pequeño",
  Fragil = "Fragil",
  Refrigerado = "Refrigerado",
}

export interface Paquete {
  // Info de la tabla
  id_paquete: string;
  id_rutas_asignadas: string[]; // puede pasar por varias rutas
  id_conductor_asignado: string | null;
  destinatario: Destinatario;
  fecha_registro: string; // ISO
  fecha_entrega: string | null;

  // Detalle del paquete
  estado: PaquetesEstados;
  tipo_paquete: TipoPaquete;
  cantidad: number;
  valor_declarado: number;
  dimensiones: PaquetesDimensiones;

  // Detalles adicionales Para paquetes entregados
  observacion_conductor?: string;
  imagen_adjunta?: string;
}

// Conductores
// =====================
export enum ConductorEstado {
  Disponible = "Disponible",
  EnRuta = "En ruta",
  NoDisponible = "No disponible",
}

export interface HorarioConductor {
  inicio: string; // ISO
  fin: string; // ISO
}

export interface Conductor {
  // Info de la tabla
  id_conductor: string;
  nombre: string;
  apellido: string;
  estado: ConductorEstado;
  horario?: HorarioConductor;
  id_vehiculo_asignado?: string;

  // Detalles del conductor
  correo: string;
  nombre_empresa: string;
  telefono: string;
  tipo_documento: string;
  documento: string;
}

// Rutas
// =====================
export enum RutaEstado {
  Pendiente = "Pendiente",
  asignada = "Asignada",
  Completada = "Completada",
  Fallida = "Fallida",
}

export interface HorarioRuta {
  inicio: string; // ISO
  fin: string; // ISO
}

export enum ZonaRuta {
  Sur = "Sur",
  Centro = "Centro",
  Norte = "Norte",
}

export interface Ruta {
  // Info de la tabla
  id_ruta: string;
  id_conductor_asignado: string | null;
  paquetes_asignados: string[]; // array de ids de paquetes
  horario: HorarioRuta;
  zona: ZonaRuta;
  fecha_registro: string; // ISO
  estado: RutaEstado;

  // Detalles de la ruta
  puntos_entrega: string; // a futuro: coordenadas [{lat, lng, direccion}]
}

// Vehículos
// =====================
export enum VehiculoEstado {
  Disponible = "Disponible",
  EnRuta = "En ruta",
  NoDisponible = "No disponible",
}

export type TipoVehiculo = "Camión" | "Furgón" | "Camioneta" | "Moto";

export interface Vehiculo {
  // Info de la tabla
  id_vehiculo: string;
  placa: string;
  tipo_vehiculo: TipoVehiculo;
  estado: VehiculoEstado;
  fecha_mantenimiento: string; // ISO
}

// --- DATOS MOCK ---

// Destinatario
export const mockDestinatarios: Destinatario[] = [
  {
    nombre: "Ana",
    apellido: "López",
    direccion: "Av. Siempre Viva 742",
    correo: "ana.lopez@ejemplo.com",
    telefono: "310-555-0101",
  },
  {
    nombre: "Luis",
    apellido: "Gómez",
    direccion: "Carrera 5 #12-34",
    correo: "luis.gomez@ejemplo.com",
    telefono: "310-555-0102",
  },
  {
    nombre: "Sofía",
    apellido: "Ramírez",
    direccion: "Calle 100 #25-67",
    correo: "sofia.ramirez@ejemplo.com",
    telefono: "310-555-0103",
  },
];
// Paquetes
export const mockPaquetes: Paquete[] = [
  {
    id_paquete: "PAQ-001",
    id_rutas_asignadas: [],
    id_conductor_asignado: null,
    destinatario: mockDestinatarios[0],
    fecha_registro: "2025-09-03T10:00:00Z",
    fecha_entrega: null,
    estado: PaquetesEstados.Pendiente,
    tipo_paquete: TipoPaquete.Grande,
    cantidad: 1,
    valor_declarado: 150000,
    dimensiones: { largo: 30, ancho: 20, alto: 10, peso: 2 },
  },
  {
    id_paquete: "PAQ-002",
    id_rutas_asignadas: ["RTA-001"],
    id_conductor_asignado: "CON-002",
    destinatario: mockDestinatarios[1],
    fecha_registro: "2025-09-03T12:30:00Z",
    fecha_entrega: null,
    estado: PaquetesEstados.Asignado,
    tipo_paquete: TipoPaquete.Fragil,
    cantidad: 1,
    valor_declarado: 50000,
    dimensiones: { largo: 15, ancho: 10, alto: 5, peso: 0.5 },
  },
  {
    id_paquete: "PAQ-003",
    id_rutas_asignadas: ["RTA-001"],
    id_conductor_asignado: "CON-002",
    destinatario: mockDestinatarios[2],
    fecha_registro: "2025-09-03T14:45:00Z",
    fecha_entrega: "2025-09-04T12:10:00Z", // para que se vea en la tabla
    estado: PaquetesEstados.Entregado,
    tipo_paquete: TipoPaquete.Mediano,
    cantidad: 2,
    valor_declarado: 80000,
    dimensiones: { largo: 25, ancho: 15, alto: 8, peso: 1.5 },
    observacion_conductor: "Reibido por el destinatario",
    imagen_adjunta: "/evidencias/paq-003.jpg",
  },
  // NUEVOS
  {
    id_paquete: "PAQ-004",
    id_rutas_asignadas: ["RTA-001"],
    id_conductor_asignado: "CON-002",
    destinatario: mockDestinatarios[0],
    fecha_registro: "2025-09-04T08:05:00Z",
    fecha_entrega: null,
    estado: PaquetesEstados.EnRuta,
    tipo_paquete: TipoPaquete.Refrigerado,
    cantidad: 3,
    valor_declarado: 120000,
    dimensiones: { largo: 40, ancho: 25, alto: 20, peso: 5 },
  },
  {
    id_paquete: "PAQ-005",
    id_rutas_asignadas: ["RTA-002"],
    id_conductor_asignado: "CON-001",
    destinatario: mockDestinatarios[1],
    fecha_registro: "2025-09-04T08:15:00Z",
    fecha_entrega: null,
    estado: PaquetesEstados.Fallido,
    tipo_paquete: TipoPaquete.Pequeño,
    cantidad: 1,
    valor_declarado: 20000,
    dimensiones: { largo: 10, ancho: 8, alto: 5, peso: 0.3 },
    observacion_conductor:
      "Habia paro en la nacho, la via estaba bloqueada y por ende no pude entregar.",
  },
];

// Ajusta rutas para reflejar los nuevos pedidos
export const mockRutas: Ruta[] = [
  {
    id_ruta: "RTA-001",
    id_conductor_asignado: "CON-002",
    paquetes_asignados: ["PAQ-002", "PAQ-003", "PAQ-004"],
    horario: { inicio: "2025-09-04T09:00:00Z", fin: "2025-09-04T14:00:00Z" },
    zona: ZonaRuta.Norte,
    fecha_registro: "2025-09-04T08:30:00Z",
    estado: RutaEstado.Pendiente, // <-- NUEVO
    puntos_entrega: "Calle 100 #25-67, Calle 80 #15-30",
  },
  {
    id_ruta: "RTA-002",
    id_conductor_asignado: null,
    paquetes_asignados: [],
    horario: { inicio: "2025-09-05T10:00:00Z", fin: "2025-09-05T15:00:00Z" },
    zona: ZonaRuta.Norte,
    fecha_registro: "2025-09-05T09:00:00Z",
    estado: RutaEstado.Pendiente,
    puntos_entrega: "",
  },
  {
    id_ruta: "RTA-003",
    id_conductor_asignado: "CON-001",
    paquetes_asignados: ["PAQ-005"],
    horario: { inicio: "2025-09-04T10:00:00Z", fin: "2025-09-04T15:00:00Z" },
    zona: ZonaRuta.Sur,
    fecha_registro: "2025-09-04T09:00:00Z",
    estado: RutaEstado.Pendiente, // <-- NUEVO
    puntos_entrega: "Av. Siempre Viva 742",
  },
];

// Conductores
export const mockConductores: Conductor[] = [
  {
    id_conductor: "CON-001",
    nombre: "Juan",
    apellido: "Pérez",
    estado: ConductorEstado.Disponible,
    id_vehiculo_asignado: "VEH-001",
    correo: "juan.perez@empresa.com",
    nombre_empresa: "Logística Rápida",
    telefono: "310-123-4567",
    tipo_documento: "Cédula de Ciudadanía",
    documento: "1018456789",
    horario: {
      inicio: "2025-09-04T08:00:00Z",
      fin: "2025-09-04T17:00:00Z",
    },
  },
  {
    id_conductor: "CON-002",
    nombre: "María",
    apellido: "García",
    estado: ConductorEstado.EnRuta,
    id_vehiculo_asignado: "VEH-002",
    correo: "maria.garcia@empresa.com",
    nombre_empresa: "Entrega Express",
    telefono: "310-987-6543",
    tipo_documento: "Cédula de Ciudadanía",
    documento: "1018987654",
    horario: {
      inicio: "2025-09-04T09:00:00Z",
      fin: "2025-09-04T18:00:00Z",
    },
  },
];

// Vehiculos
export const mockVehiculos: Vehiculo[] = [
  {
    id_vehiculo: "VEH-001",
    placa: "ABC-123",
    tipo_vehiculo: "Camioneta",
    estado: VehiculoEstado.Disponible,
    fecha_mantenimiento: "2025-08-01T00:00:00Z",
  },
  {
    id_vehiculo: "VEH-002",
    placa: "DEF-456",
    tipo_vehiculo: "Furgón",
    estado: VehiculoEstado.EnRuta,
    fecha_mantenimiento: "2025-07-15T00:00:00Z",
  },
  {
    id_vehiculo: "VEH-003",
    placa: "GHI-789",
    tipo_vehiculo: "Moto",
    estado: VehiculoEstado.Disponible,
    fecha_mantenimiento: "2025-09-02T00:00:00Z",
  },
];
