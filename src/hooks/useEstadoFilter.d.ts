// src/hooks/useEstadoFilter.d.ts
export type OpcionesFiltro<T> = {
  valor: T | null;
  etiqueta: string;
}[];

interface UseEstadoFilterConfig<T> {
  opciones: OpcionesFiltro<T>;
  valorInicial?: T | null;
  obtenerEstado: (item: any) => T;
}

interface UseEstadoFilterReturn<T> {
  estadoSeleccionado: T | null;
  setEstadoSeleccionado: (valor: T | null) => void;
  filtrarPorEstado: (items: any[]) => any[];
  contarPorEstado: (items: any[]) => { [key: string]: number };
  limpiarFiltro: () => void;
  opciones: OpcionesFiltro<T>;
}

export function useEstadoFilter<T>(
  config: UseEstadoFilterConfig<T>
): UseEstadoFilterReturn<T>;