// src/hooks/useEstadoFilter.ts
import { useState, useMemo } from 'react';

export type OpcionesFiltro<T> = {
  valor: T | null;
  etiqueta: string;
}[];

interface UseEstadoFilterConfig<T> {
  opciones: OpcionesFiltro<T>;
  valorInicial?: T | null;
  // Función para extraer el estado de cada elemento
  obtenerEstado: (item: any) => T;
}

export function useEstadoFilter<T>({
  opciones,
  valorInicial = null,
  obtenerEstado
}: UseEstadoFilterConfig<T>) {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<T | null>(valorInicial);

  // Función para filtrar una lista basada en el estado seleccionado
  const filtrarPorEstado = useMemo(() => {
    return (items: any[]) => {
      if (estadoSeleccionado === null) {
        return items; // Sin filtro, devuelve todos
      }
      return items.filter(item => obtenerEstado(item) === estadoSeleccionado);
    };
  }, [estadoSeleccionado, obtenerEstado]);

  // Función para contar elementos por estado
  const contarPorEstado = useMemo(() => {
    return (items: any[]) => {
      const contadores: { [key: string]: number } = {};
      
      // Inicializar contadores
      opciones.forEach(opcion => {
        const key = opcion.valor === null ? 'todos' : String(opcion.valor);
        contadores[key] = 0;
      });

      // Contar elementos
      items.forEach(item => {
        const estado = obtenerEstado(item);
        const key = String(estado);
        if (contadores[key] !== undefined) {
          contadores[key]++;
        }
      });

      // Contar todos
      contadores['todos'] = items.length;

      return contadores;
    };
  }, [opciones, obtenerEstado]);

  const limpiarFiltro = () => setEstadoSeleccionado(null);

  return {
    estadoSeleccionado,
    setEstadoSeleccionado,
    filtrarPorEstado,
    contarPorEstado,
    limpiarFiltro,
    opciones
  };
}