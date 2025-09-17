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
import {
  Empresa,
  Destinatario,
  Paquete,
  PaquetesEstados,
  TipoPaquete,
  Conductor,
  ConductorEstado,
  Ruta,
  RutaEstado,
  ZonaRuta,
  Vehiculo,
  VehiculoEstado,
} from "./types";

// === Destinatarios ===
export const mockDestinatarios: Destinatario[] = [
  {
    nombre: "Maria",
    apellido: "Liliana",
    direccion: "Av. Siempre Viva 742",
    correo: "maria@gmail.com",
    telefono: "310-555-0101",
  },
  {
    nombre: "Linus",
    apellido: "Torvals",
    direccion: "Carrera 5 #12-34",
    correo: "luis.gomez@ejemplo.com",
    telefono: "310-555-0102",
  },
  {
    nombre: "Laura",
    apellido: "Sofia",
    direccion: "Calle 100 #25-67",
    correo: "laurasofiasanchezorozco8@gmail.com",
    telefono: "310-555-0103",
  },
  {
    nombre: "Johann",
    apellido: "Gómez",
    direccion: "Cra. 45 #80-12",
    correo: "johanns.gomeze@gmail.com",
    telefono: "310-555-0104",
  },
];

// === Paquetes ===
export const mockPaquetes: Paquete[] = [
  {
    id_paquete: "PAQ-001",
    id_rutas_asignadas: [], // aún no asignado
    id_conductor_asignado: null, // sin conductor
    destinatario: mockDestinatarios[0],
    fecha_registro: "2025-09-03T10:00:00Z",
    fecha_entrega: null,
    estado: PaquetesEstados.Pendiente,
    tipo_paquete: TipoPaquete.Refrigerado,
    cantidad: 1,
    valor_declarado: 150000,
    dimensiones: { largo: 30, ancho: 20, alto: 10, peso: 2 },
  },
  {
    id_paquete: "PAQ-002",
    id_rutas_asignadas: ["RTA-001"],
    id_conductor_asignado: null, // asignado a ruta, pero aún no hay conductor
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
    fecha_entrega: "2025-09-04T12:10:00Z",
    estado: PaquetesEstados.Entregado,
    tipo_paquete: TipoPaquete.Mediano,
    cantidad: 2,
    valor_declarado: 80000,
    dimensiones: { largo: 25, ancho: 15, alto: 8, peso: 1.5 },
    observacion_conductor: "Recibido por el destinatario",
    imagen_adjunta: "/evidencias/paq-003.jpg",
  },
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
    observacion_conductor: "La vía estaba bloqueada, no se pudo entregar.",
  },
];

// === Conductores ===
export const mockConductores: Conductor[] = [
  {
    id_conductor: "CON-001",
    nombre: "Cesar",
    apellido: "Gómez",
    estado: ConductorEstado.EnRuta,
    id_vehiculo_asignado: "VEH-001",
    nombre_empresa: Empresa.Servientrega,
    correo: "cesar.gomez@servientrega.com",
    telefono: "310-123-4567",
    tipo_documento: "Cédula de Ciudadanía",
    documento: "1018456789",
    horario: { inicio: "2025-09-04T08:00:00Z", fin: "2025-09-04T17:00:00Z" },
  },
  {
    id_conductor: "CON-002",
    nombre: "Kevin",
    apellido: "David",
    estado: ConductorEstado.EnRuta,
    id_vehiculo_asignado: "VEH-002",
    correo: "kevin.david@servientrega.com",
    nombre_empresa: Empresa.Servientrega,
    telefono: "310-987-6543",
    tipo_documento: "Cédula de Ciudadanía",
    documento: "1018987654",
    horario: { inicio: "2025-09-04T09:00:00Z", fin: "2025-09-04T18:00:00Z" },
  },
  {
    id_conductor: "CON-003",
    nombre: "Jared",
    apellido: "Estrada",
    estado: ConductorEstado.Disponible,
    id_vehiculo_asignado: "VEH-003",
    correo: "jared.estrada@servientrega.com",
    nombre_empresa: Empresa.Servientrega,
    telefono: "310-555-0199",
    tipo_documento: "Cédula de Ciudadanía",
    documento: "1023456789",
    horario: { inicio: "2025-09-04T09:00:00Z", fin: "2025-09-04T18:00:00Z" },
  },
  {
    id_conductor: "CON-004",
    nombre: "Dayanna",
    apellido: "Estrada",
    estado: ConductorEstado.Disponible,
    id_vehiculo_asignado: "VEH-002",
    correo: "dayanna.estrada@servientrega.com",
    nombre_empresa: Empresa.Servientrega,
    telefono: "310-555-0199",
    tipo_documento: "Cédula de Ciudadanía",
    documento: "1023456790",
  },
  {
    id_conductor: "CON-005",
    nombre: "Adriana",
    apellido: "Estrada",
    estado: ConductorEstado.NoDisponible,
    id_vehiculo_asignado: "VEH-001",
    correo: "adriana.estrada@servientrega.com",
    nombre_empresa: Empresa.Servientrega,
    telefono: "310-555-0199",
    tipo_documento: "Cédula de Ciudadanía",
    documento: "1023456791",
  },
];

// === Vehículos ===
export const mockVehiculos: Vehiculo[] = [
  {
    id_vehiculo: "VEH-001",
    placa: "ABC-123",
    tipo_vehiculo: "Camioneta",
    estado: VehiculoEstado.Disponible, // porque CON-001 está en ruta
    fecha_mantenimiento: "2025-08-01T00:00:00Z",
  },
  {
    id_vehiculo: "VEH-002",
    placa: "DEF-456",
    tipo_vehiculo: "Furgón",
    estado: VehiculoEstado.Disponible, // porque CON-002 está en ruta
    fecha_mantenimiento: "2025-07-15T00:00:00Z",
  },
  {
    id_vehiculo: "VEH-003",
    placa: "GHI-789",
    tipo_vehiculo: "Moto",
    estado: VehiculoEstado.Disponible, // porque CON-003 está disponible
    fecha_mantenimiento: "2025-09-02T00:00:00Z",
  },
];

// === Rutas ===
export const mockRutas: Ruta[] = [
  {
    id_ruta: "RTA-001",
    id_conductor_asignado: null, // pendiente → sin conductor
    paquetes_asignados: ["PAQ-002"], // ya tiene paquetes
    horario: { inicio: "2025-09-04T09:00:00Z", fin: "2025-09-04T14:00:00Z" },
    zona: ZonaRuta.Norte,
    fecha_registro: "2025-09-04T08:30:00Z",
    estado: RutaEstado.Pendiente,
    puntos_entrega: "Calle 100 #25-67, Calle 80 #15-30",
  },
  {
    id_ruta: "RTA-002",
    id_conductor_asignado: "CON-001",
    paquetes_asignados: ["PAQ-005"],
    horario: { inicio: "2025-09-05T10:00:00Z", fin: "2025-09-05T15:00:00Z" },
    zona: ZonaRuta.Sur,
    fecha_registro: "2025-09-05T09:00:00Z",
    estado: RutaEstado.Fallida,
    puntos_entrega: "Av. Siempre Viva 742",
  },
  {
    id_ruta: "RTA-003",
    id_conductor_asignado: "CON-002",
    paquetes_asignados: ["PAQ-003", "PAQ-004"],
    horario: { inicio: "2025-09-06T08:00:00Z", fin: "2025-09-06T13:00:00Z" },
    zona: ZonaRuta.Centro,
    fecha_registro: "2025-09-06T07:30:00Z",
    estado: RutaEstado.Completada,
    puntos_entrega: "Cra. 45 #80-12",
  },
  {
    id_ruta: "RTA-004",
    id_conductor_asignado: "CON-003",
    paquetes_asignados: ["PAQ-001"],
    horario: { inicio: "2025-09-05T10:00:00Z", fin: "2025-09-05T15:00:00Z" },
    zona: ZonaRuta.Sur,
    fecha_registro: "2025-09-05T09:00:00Z",
    estado: RutaEstado.Asignada,
    puntos_entrega: "calle 77sur",
  },
];
