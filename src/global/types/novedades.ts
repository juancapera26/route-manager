// src/global/types/novedades.types.ts

// Tipos de novedades

export interface Novelty {
  id_novedad: number;
  descripcion: string;
  fecha: string; 
  tipo: string; // ej. 'Logística' o 'Operativa'
  id_usuario: number;
  imagen?: string;
  usuario?: NoveltyUser;
}

export interface NoveltyUser {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo?: string;
  telefono_movil?: string;
  foto_perfil?: string;
}

export enum NovedadesTipo {
  Logistica = "Logística",
  Operativa = "Operativa",
}

export interface NoveltyUIState {
  selectedNovelty: Novelty | null;
  isDetailModalOpen: boolean;
  isDeleteDialogOpen: boolean;
  noveltyToDelete: number | null;
}
