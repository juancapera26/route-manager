import React, { useState, useEffect } from "react";
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
  EnRuta = "En Ruta",
  Completada = "Completada",
  Fallida = "Fallida",
}

enum EstadoConductor {
  Disponible = "Disponible",
  NoDisponible = "No_disponible",
}

// ========================================
// CONFIGURACIÓN DE COLORES
// ========================================

const coloresGraficos = {
  paquetes: {
    Pendiente: "#FD853A",
    Asignado: "#465FFF",
    Entregado: "#12B76A",
    Fallido: "#F04438",
  },
  rutas: {
    Pendiente: "#FD853A",
    "En Ruta": "#465FFF",
    Completada: "#12B76A",
    Fallida: "#F04438",
  },
};

// ========================================
// COMPONENTES DE TOOLTIP
// ========================================

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

const TooltipDonaSimple = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.total;
    const value = payload[0].value;
    const porcentaje = ((value / total) * 100).toFixed(1);
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-white">
          {payload[0].name}
        </p>
        <p className="text-sm" style={{ color: payload[0].payload.fill }}>
          Cantidad: {value}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {porcentaje}% del total
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

  // ========================================
  // CÁLCULOS DE DATOS REALES
  // ========================================

  // PAQUETES
  const totalPaquetes = paquetes.length;
  const paquetesPendientes = paquetes.filter(p => p.estado === PaquetesEstados.Pendiente).length;
  const paquetesAsignados = paquetes.filter(p => p.estado === PaquetesEstados.Asignado).length;
  const paquetesEntregados = paquetes.filter(p => p.estado === PaquetesEstados.Entregado).length;
  const paquetesFallidos = paquetes.filter(p => p.estado === PaquetesEstados.Fallido).length;

  // RUTAS
  const totalRutas = rutas.length;
  const rutasPendientes = rutas.filter(r => r.estado_ruta === "Pendiente").length;
  const rutasEnRuta = rutas.filter(r => r.estado_ruta === "En Ruta" || r.estado_ruta === "Asignado").length;
  const rutasCompletadas = rutas.filter(r => r.estado_ruta === EstadoRuta.Completada).length;
  const rutasFallidas = rutas.filter(r => r.estado_ruta === EstadoRuta.Fallida).length;

  // CONDUCTORES
  const totalConductores = conductores?.length || 0;
  const conductoresDisponibles = conductores?.filter(c => c.estado === EstadoConductor.Disponible).length || 0;
  const conductoresNoDisponibles = conductores?.filter(c => c.estado === EstadoConductor.NoDisponible).length || 0;

  // ========================================
  // DATOS PARA GRÁFICAS
  // ========================================

  // Card 1: Paquetes
  const datosPaquetesGrafica = [
    { nombre: "Total", Entregados: paquetesEntregados, Fallidos: paquetesFallidos }
  ];

  // Card 2: Rutas
  const datosRutasGrafica = [
    { nombre: "Total", Completadas: rutasCompletadas, Fallidas: rutasFallidas }
  ];

  // Card 3: Conductores
  const datosConductoresGrafica = [
    { nombre: "Total", Disponibles: conductoresDisponibles, "No Disponibles": conductoresNoDisponibles }
  ];

  // Card 4: Estado de Paquetes (Dona)
  const totalPaquetesParaDona = totalPaquetes || 1; // Evitar división por cero
  const datosEstadoPaquetesHoy = [
    {
      name: "Pendientes",
      value: paquetesPendientes,
      fill: coloresGraficos.paquetes.Pendiente,
      total: totalPaquetesParaDona,
    },
    {
      name: "Asignados",
      value: paquetesAsignados,
      fill: coloresGraficos.paquetes.Asignado,
      total: totalPaquetesParaDona,
    },
    {
      name: "Entregados",
      value: paquetesEntregados,
      fill: coloresGraficos.paquetes.Entregado,
      total: totalPaquetesParaDona,
    },
    {
      name: "Fallidos",
      value: paquetesFallidos,
      fill: coloresGraficos.paquetes.Fallido,
      total: totalPaquetesParaDona,
    },
  ];

  // Card 5: Resumen de Eficiencia
  const totalEntregasIntentadas = paquetesEntregados + paquetesFallidos;
  const tasaExito = totalEntregasIntentadas > 0 
    ? Math.round((paquetesEntregados / totalEntregasIntentadas) * 100) 
    : 0;

  // Card 6: Estado de Rutas
  const datosEstadoRutas = [
    {
      estado: "Pendientes",
      cantidad: rutasPendientes,
      color: coloresGraficos.rutas.Pendiente,
    },
    {
      estado: "En Ruta",
      cantidad: rutasEnRuta,
      color: coloresGraficos.rutas["En Ruta"],
    },
    {
      estado: "Completadas",
      cantidad: rutasCompletadas,
      color: coloresGraficos.rutas.Completada,
    },
    {
      estado: "Fallidas",
      cantidad: rutasFallidas,
      color: coloresGraficos.rutas.Fallida,
    },
  ];

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

      {/* Métricas principales: tres cards horizontales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ComponentCard title="Paquetes" desc={`Total: ${totalPaquetes}`}>
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

        <ComponentCard title="Rutas" desc={`Total: ${totalRutas}`}>
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
                  Fallidas: {rutasFallidas}
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
                    dataKey="Fallidas"
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
                <BarChart data={datosConductoresGrafica}>
                  <XAxis dataKey="nombre" tick={{ fontSize: 8 }} />
                  <Tooltip content={<TooltipPersonalizado />} />
                  <Bar dataKey="Disponibles" stackId="a" fill="#36BFFA" radius={[0, 0, 2, 2]} />
                  <Bar dataKey="No Disponibles" stackId="a" fill="#667085" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Segunda fila: Card 4 y Card 5 */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8">
        {/* Card 4: Estado de Paquetes (Dona) */}
        <div className="xl:col-span-3">
          <ComponentCard title="Distribución de Paquetes por Estado">
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Vista general del estado actual de todos los paquetes
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Gráfico de dona */}
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

                {/* Total de paquetes */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total de paquetes:
                    </span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalPaquetes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>

        {/* Card 5: Eficiencia de Entregas */}
        <div className="xl:col-span-2">
          <ComponentCard title="Eficiencia de Entregas">
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Tasa de éxito en entregas completadas
            </div>

            {/* KPI Principal */}
            <div className="p-6 bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 rounded-lg mb-6">
              <div className="text-center">
                <p className="text-sm font-medium text-success-700 dark:text-success-400 mb-2">
                  Tasa de Éxito
                </p>
                <p className="text-5xl font-bold text-success-800 dark:text-success-300 mb-2">
                  {tasaExito}%
                </p>
                <p className="text-xs text-success-600 dark:text-success-500">
                  {paquetesEntregados} exitosos de {totalEntregasIntentadas} intentos
                </p>
              </div>
            </div>

            {/* Desglose de estados */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Entregados
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {paquetesEntregados}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fallidos
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {paquetesFallidos}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    En Proceso
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {paquetesAsignados + paquetesPendientes}
                </span>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>

      {/* Card 6: Estado de Rutas */}
      <div className="w-full">
        <ComponentCard title="Estado Actual de Rutas">
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Resumen del estado de todas las rutas del sistema
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {datosEstadoRutas.map((ruta) => (
              <div
                key={ruta.estado}
                className="p-6 bg-white dark:bg-gray-800 border-2 rounded-lg hover:shadow-lg transition-all"
                style={{ borderColor: ruta.color }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: ruta.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {ruta.estado}
                  </span>
                </div>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {ruta.cantidad}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {totalRutas > 0 
                    ? `${((ruta.cantidad / totalRutas) * 100).toFixed(0)}% del total`
                    : '0% del total'
                  }
                </p>
              </div>
            ))}
          </div>

          {/* Resumen total */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total de rutas en el sistema:
              </span>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalRutas}
              </span>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
};

export default Admin;