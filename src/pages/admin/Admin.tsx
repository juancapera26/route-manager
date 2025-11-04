import React, { useMemo, useState, useEffect } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import "../../App.css";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { PackagesService } from "../../global/services/packageService";
import { getAllRutas } from "../../global/services/routeService";
import useDriver from "../../hooks/admin/condutores/useDriver";

// ========================================
// TIPOS
// ========================================

enum PaquetesEstados {
  Pendiente = "Pendiente",
  Asignado = "Asignado",
  Entregado = "Entregado",
  Fallido = "Fallido",
}

enum EstadoRuta {
  Pendiente = "Pendiente",
  Activa = "Activa",
  Completada = "Completada",
  Cancelada = "Fallida",
}

enum EstadoConductor {
  Disponible = "Disponible",
  NoDisponible = "No_disponible",
}


// ========================================
// DATOS MOCK (SOLO PARA CARDS 4, 5 Y 6)
// ========================================

// Generar últimos 2 meses dinámicamente
function generarUltimos2Meses() {
  const hoy = new Date();
  return Array.from({ length: 2 }).map((_, i) => {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - (1 - i), 1);
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    return `${año}-${mes}`;
  });
}

const ultimos2Meses = generarUltimos2Meses();

// --- Entregas promedio por mes ---
const tiemposEntregaMensuales = ultimos2Meses.map((mes) => ({
  mes,
  minutosPromedioEntrega: Math.floor(35 + Math.random() * 25), // 35-60 minutos
}));

// --- Estado Actual de Paquetes ---
const estadoActualPaquetes = {
  asignados: Math.floor(25 + Math.random() * 15), // 25-40 paquetes asignados
  entregados: Math.floor(180 + Math.random() * 40), // 180-220 paquetes entregados
  pendientes: Math.floor(8 + Math.random() * 12), // 8-20 paquetes pendientes
  fallidos: Math.floor(2 + Math.random() * 6), // 2-8 paquetes fallidos
};

// --- Estado actual de rutas del día ---
const estadoActualRutas = {
  asignadas: Math.floor(8 + Math.random() * 6), // 8-14 rutas asignadas
  completadas: Math.floor(12 + Math.random() * 8), // 12-20 rutas completadas
  pendientes: Math.floor(3 + Math.random() * 5), // 3-8 rutas pendientes
  fallidas: Math.floor(0 + Math.random() * 3), // 0-3 rutas fallidas
};

// --- Métricas operativas diarias ---
const metricasOperativasDiarias = {
  porcentajeEntregasExitosas: Math.round(
    (estadoActualPaquetes.entregados /
      (estadoActualPaquetes.entregados + estadoActualPaquetes.fallidos)) *
      100
  ),
  totalPaquetesDelDia: Object.values(estadoActualPaquetes).reduce(
    (a, b) => a + b,
    0
  ),
  totalRutasDelDia: Object.values(estadoActualRutas).reduce((a, b) => a + b, 0),
};

// --- Configuración de colores ---
const coloresGraficos = {
  paquetes: {
    asignados: "#465FFF",
    entregados: "#12B76A",
    pendientes: "#FD853A",
    fallidos: "#F04438",
  },
  rutas: {
    asignadas: "#465FFF",
    completadas: "#12B76A",
    pendientes: "#FD853A",
    fallidas: "#F04438",
  },
};

// --- Etiquetas en español ---
const etiquetasEstados = {
  paquetes: {
    asignados: "Asignados",
    entregados: "Entregados",
    pendientes: "Pendientes",
    fallidos: "Fallidos",
  },
  rutas: {
    asignadas: "Asignadas",
    completadas: "Completadas",
    pendientes: "Pendientes",
    fallidas: "Fallidas",
  },
};

// ========================================
// FUNCIONES AUXILIARES
// ========================================

// Función para formatear mes en español
const formatearMes = (fechaMes: string) => {
  const [año, mes] = fechaMes.split("-");
  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return `${meses[parseInt(mes) - 1]} ${año}`;
};

// Tooltip genérico
const TooltipPersonalizado = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Tooltip personalizado para la dona (sin líneas externas)
const TooltipDonaSimple = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">
          {payload[0].name}
        </p>
        <p className="text-sm" style={{ color: payload[0].payload.fill }}>
          Cantidad: {payload[0].value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
          del total
        </p>
      </div>
    );
  }
  return null;
};

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const Admin: React.FC = () => {
  // Estados para datos reales
  const [paquetes, setPaquetes] = useState<any[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);
  const [loadingPaquetes, setLoadingPaquetes] = useState(true);
  const [loadingRutas, setLoadingRutas] = useState(true);

  

  // Hook de conductores
  const { data: conductores, loading: loadingConductores } = useDriver();

  console.table(conductores.map(c => ({ nombre: c.nombre, estado: c.estado })));
  console.log('Conductores:', conductores);

  // Fetch paquetes
  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const data = await PackagesService.getAll();
        setPaquetes(data);
      } catch (error) {
        console.error("Error al cargar paquetes:", error);
      } finally {
        setLoadingPaquetes(false);
      }
    };
    fetchPaquetes();
  }, []);

  // Fetch rutas
  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const data = await getAllRutas();
        setRutas(data);
      } catch (error) {
        console.error("Error al cargar rutas:", error);
      } finally {
        setLoadingRutas(false);
      }
    };
    fetchRutas();
  }, []);

  // FILTRADO DE DATOS REALES - TOTAL DE TODOS (no solo por estado)
  const totalPaquetes = paquetes.length;
  const paquetesEntregados = paquetes.filter(p => p.estado === PaquetesEstados.Entregado).length;
  const paquetesFallidos = paquetes.filter(p => p.estado === PaquetesEstados.Fallido).length;

  const totalRutas = rutas.length;
  const rutasCompletadas = rutas.filter(r => r.estado_ruta === EstadoRuta.Completada).length;
  const rutasCanceladas = rutas.filter(r => r.estado_ruta === EstadoRuta.Cancelada).length;

  const totalConductores = conductores?.length || 0;
  const conductoresDisponibles = conductores?.filter(c => c.estado === EstadoConductor.Disponible).length || 0;
  const conductoresNoDisponibles = conductores?.filter(c => c.estado === EstadoConductor.NoDisponible).length || 0;

  // Datos para las 3 primeras gráficas
  const datosPaquetesGrafica = [
    { nombre: "Total", Entregados: paquetesEntregados, Fallidos: paquetesFallidos }
  ];

  const datosRutasGrafica = [
    { nombre: "Total", Completadas: rutasCompletadas, Canceladas: rutasCanceladas }
  ];

  const datosConductoresGrafica = [
    { nombre: "Total", Disponibles: conductoresDisponibles, "No Disponibles": conductoresNoDisponibles }
  ];

  const datosTiemposEntregaGrafica = tiemposEntregaMensuales.map((m) => ({
    nombre: formatearMes(m.mes),
    "Tiempo Promedio": m.minutosPromedioEntrega,
  }));

  // Card 4: Estado de Paquetes (Hoy) - DATOS SIMPLIFICADOS para dona sin etiquetas
  const datosEstadoPaquetesHoy = useMemo(() => {
    const total = Object.values(estadoActualPaquetes).reduce(
      (a, b) => a + b,
      0
    );
    return [
      {
        name: etiquetasEstados.paquetes.asignados,
        value: estadoActualPaquetes.asignados,
        fill: coloresGraficos.paquetes.asignados,
        total,
      },
      {
        name: etiquetasEstados.paquetes.entregados,
        value: estadoActualPaquetes.entregados,
        fill: coloresGraficos.paquetes.entregados,
        total,
      },
      {
        name: etiquetasEstados.paquetes.pendientes,
        value: estadoActualPaquetes.pendientes,
        fill: coloresGraficos.paquetes.pendientes,
        total,
      },
      {
        name: etiquetasEstados.paquetes.fallidos,
        value: estadoActualPaquetes.fallidos,
        fill: coloresGraficos.paquetes.fallidos,
        total,
      },
    ];
  }, []);

  // Card 6: Estado de rutas por hora
  const datosEstadoRutasHoy = useMemo(() => {
    const horas = [
      "8:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00",
      "22:00",
    ];
    return horas.map((hora, index) => {
      const factorProgreso = (index + 1) / horas.length;
      return {
        hora,
        Asignadas: Math.max(
          0,
          Math.floor(estadoActualRutas.asignadas * (0.8 - factorProgreso * 0.5))
        ),
        Completadas: Math.max(
          0,
          Math.floor(estadoActualRutas.completadas * factorProgreso)
        ),
        Pendientes: Math.max(
          0,
          Math.floor(estadoActualRutas.pendientes * (1 - factorProgreso))
        ),
        Fallidas: Math.max(
          0,
          Math.floor(estadoActualRutas.fallidas * factorProgreso)
        ),
      };
    });

  }, []);

  return (
    <div className="relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white typewriter-container">
          <span className="typewriter-word first">Bienvenido</span>
          <span className="typewriter-word second">Administrador</span>
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Resumen operativo - {new Date().toLocaleDateString("es-ES")}
        </p>
      </div>

      {/* Métricas principales: tres cards horizontales CON DATOS REALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ComponentCard
          title="Paquetes"
          desc={`Total: ${totalPaquetes}`}
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {totalPaquetes}
              </p>
              <div className="space-y-1">
                <p className="text-sm text-success-600 dark:text-success-400 flex items-center">
                  <span className="w-2 h-2 bg-success-500 rounded-full mr-2"></span>
                  Entregados: {paquetesEntregados}
                </p>
                <p className="text-sm text-error-600 dark:text-error-400 flex items-center">
                  <span className="w-2 h-2 bg-error-500 rounded-full mr-2"></span>
                  Fallidos: {paquetesFallidos}
                </p>
              </div>
            </div>
            <div className="w-44 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosPaquetesGrafica}>
                  <XAxis dataKey="nombre" tick={{ fontSize: 8 }} />
                  <Tooltip content={<TooltipPersonalizado />} />
                  <Bar
                    dataKey="Entregados"
                    stackId="a"
                    fill="#12B76A"
                    radius={[0, 0, 2, 2]}
                  />
                  <Bar
                    dataKey="Fallidos"
                    stackId="a"
                    fill="#F04438"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Rutas"
          desc={`Total: ${totalRutas}`}
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {totalRutas}
              </p>
              <div className="space-y-1">
                <p className="text-sm text-success-600 dark:text-success-400 flex items-center">
                  <span className="w-2 h-2 bg-success-500 rounded-full mr-2"></span>
                  Completadas: {rutasCompletadas}
                </p>
                <p className="text-sm text-error-600 dark:text-error-400 flex items-center">
                  <span className="w-2 h-2 bg-error-500 rounded-full mr-2"></span>
                  Canceladas: {rutasCanceladas}
                </p>
              </div>
            </div>
            <div className="w-44 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosRutasGrafica}>
                  <XAxis dataKey="nombre" tick={{ fontSize: 8 }} />
                  <Tooltip content={<TooltipPersonalizado />} />
                  <Bar
                    dataKey="Completadas"
                    stackId="a"
                    fill="#12B76A"
                    radius={[0, 0, 2, 2]}
                  />
                  <Bar
                    dataKey="Canceladas"
                    stackId="a"
                    fill="#F04438"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ComponentCard>

<ComponentCard title="Conductores" desc={`Total: ${totalConductores}`}>
  <div className="flex items-end justify-between gap-4">
    <div>
      <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {totalConductores}
      </p>
      <div className="space-y-1">
        <p className="text-sm text-blue-light-600 dark:text-blue-light-400 flex items-center">
          <span className="w-2 h-2 bg-blue-light-500 rounded-full mr-2"></span>
          Disponibles: {conductoresDisponibles}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
          No disponibles: {conductoresNoDisponibles}
        </p>
      </div>
    </div>

    <div className="w-44 h-28">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={[
            {
              nombre: "Total",
              Disponibles: conductoresDisponibles,
              "No disponibles": conductoresNoDisponibles,
            },
          ]}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <XAxis dataKey="nombre" tick={{ fontSize: 8 }} />
          <Tooltip content={<TooltipPersonalizado />} />
          <Bar dataKey="Disponibles" stackId="a" fill="#36BFFA" radius={[0, 0, 2, 2]} />
          <Bar dataKey="No disponibles" stackId="a" fill="#667085" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</ComponentCard>
      </div>

      {/* Segunda fila: Card 4 y Card 5 */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
        {/* Card 4: Estado de Paquetes (Hoy) - Dona SIN líneas conectoras */}
        <div className="xl:col-span-3">
          <ComponentCard title="Estado de Paquetes (Hoy)">
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Distribución actual de paquetes por estado
            </div>

            {/* Layout responsivo: gráfico arriba en móvil, lado a lado en desktop */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Gráfico de dona SIMPLE (sin etiquetas externas) */}
              <div
                className="flex-shrink-0 mx-auto lg:mx-0"
                style={{ width: 300, height: 250 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosEstadoPaquetesHoy}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {datosEstadoPaquetesHoy.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<TooltipDonaSimple />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Leyenda y estadísticas */}
              <div className="flex-1 min-w-0">
                <div className="space-y-2 mb-6">
                  {datosEstadoPaquetesHoy.map((estado) => (
                    <div
                      key={estado.name}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: estado.fill }}
                        ></div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {estado.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {estado.value}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({((estado.value / estado.total) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total de paquetes del día con fondo MENOS LLAMATIVO */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total de paquetes hoy:
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metricasOperativasDiarias.totalPaquetesDelDia}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Distribución en tiempo real del día actual
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Card 5: Tiempo Promedio de Entregas */}
        <div className="xl:col-span-2">
          <ComponentCard title="Tiempo Promedio de Entregas">
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Comparativa mensual de tiempos de entrega
            </div>
            <div style={{ width: "100%", height: 188 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={datosTiemposEntregaGrafica}
                  margin={{ top: 20, right: 20, left: 5, bottom: 5 }}
                >
                  <XAxis
                    dataKey="nombre"
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                    axisLine={{ stroke: "#D1D5DB" }}
                  />
                  <YAxis
                    tick={{ fill: "#6B7280", fontSize: 11 }}
                    axisLine={{ stroke: "#D1D5DB" }}
                  />
                  <Tooltip
                    content={<TooltipPersonalizado />}
                    formatter={(value: any) => [
                      `${value} min`,
                      "Tiempo Promedio",
                    ]}
                  />
                  <Bar
                    dataKey="Tiempo Promedio"
                    name="Minutos (promedio)"
                    fill="#2A31D8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Resumen Mensual:
                </h4>
                {tiemposEntregaMensuales.map((mes) => (
                  <div
                    key={mes.mes}
                    className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-700/50 mt-1"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {formatearMes(mes.mes)}
                    </span>
                    <span className="text-sm font-bold text-warning-600 dark:text-warning-400">
                      {mes.minutosPromedioEntrega} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Card 6: Panorama Operativo de Rutas - Secciones 1 y 2 */}
      <div className="w-full">
        <ComponentCard title="Panorama Operativo de Rutas">
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Monitoreo en tiempo real del estado de rutas durante el día
          </div>

          {/* Grid responsivo para organizar el contenido */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* SECCIÓN 1: KPIs Principales (4 columnas en xl) */}
            <div className="xl:col-span-4 space-y-4">
              {/* KPI Principal */}
              <div className="p-4 bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-success-700 dark:text-success-400 mb-1">
                    Tasa de Entregas Exitosas
                  </p>
                  <p className="text-4xl font-bold text-success-800 dark:text-success-300 mb-2">
                    {metricasOperativasDiarias.porcentajeEntregasExitosas}%
                  </p>
                  <p className="text-xs text-success-600 dark:text-success-500">
                    {estadoActualPaquetes.entregados} entregas exitosas de{" "}
                    {estadoActualPaquetes.entregados +
                      estadoActualPaquetes.fallidos}{" "}
                    intentos
                  </p>
                </div>
              </div>

              {/* Estados actuales en grid 2x2 */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(estadoActualRutas).map(([key, value]) => {
                  const color =
                    coloresGraficos.rutas[
                      key as keyof typeof coloresGraficos.rutas
                    ];
                  const label =
                    etiquetasEstados.rutas[
                      key as keyof typeof etiquetasEstados.rutas
                    ];

                  return (
                    <div
                      key={key}
                      className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          {label}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value as number}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        rutas
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Resumen del día */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total de rutas programadas hoy:
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {metricasOperativasDiarias.totalRutasDelDia}
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Gráfico de evolución temporal EXPANDIDO (8 columnas en xl) */}
            <div className="xl:col-span-8">
              <div className="h-full">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Evolución Durante el Día
                </h3>
                <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={datosEstadoRutasHoy}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#E5E7EB"
                        opacity={0.5}
                      />
                      <XAxis
                        dataKey="hora"
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={{ stroke: "#D1D5DB" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        tick={{ fill: "#6B7280", fontSize: 12 }}
                        axisLine={{ stroke: "#D1D5DB" }}
                        label={{
                          value: "Número de Rutas",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle" },
                        }}
                      />
                      <Tooltip content={<TooltipPersonalizado />} />
                      <Legend />

                      {/* Líneas en el orden correcto */}
                      <Line
                        type="monotone"
                        dataKey="Asignadas"
                        name="Asignadas"
                        stroke={coloresGraficos.rutas.asignadas}
                        strokeWidth={3}
                        dot={{
                          fill: coloresGraficos.rutas.asignadas,
                          strokeWidth: 2,
                          r: 5,
                        }}
                        activeDot={{
                          r: 7,
                          stroke: coloresGraficos.rutas.asignadas,
                          strokeWidth: 2,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Completadas"
                        name="Completadas"
                        stroke={coloresGraficos.rutas.completadas}
                        strokeWidth={3}
                        dot={{
                          fill: coloresGraficos.rutas.completadas,
                          strokeWidth: 2,
                          r: 5,
                        }}
                        activeDot={{
                          r: 7,
                          stroke: coloresGraficos.rutas.completadas,
                          strokeWidth: 2,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Pendientes"
                        name="Pendientes"
                        stroke={coloresGraficos.rutas.pendientes}
                        strokeWidth={2}
                        strokeDasharray="8 4"
                        dot={{
                          fill: coloresGraficos.rutas.pendientes,
                          strokeWidth: 1,
                          r: 4,
                        }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Fallidas"
                        name="Fallidas"
                        stroke={coloresGraficos.rutas.fallidas}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={{
                          fill: coloresGraficos.rutas.fallidas,
                          strokeWidth: 1,
                          r: 4,
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default Admin;