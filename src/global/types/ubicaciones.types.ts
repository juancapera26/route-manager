export type CrearUbicacionData = {
  id_ruta: number;
  lat: number;
  lng: number;
};

export interface Ubicacion {
  id?: number;
  id_ruta: number;
  lat: number;
  lng: number;
  createdAt?: string;
}

// Resultado al crear una ubicación
export type CrearUbicacionResult = {
  ok: boolean;
  data?: Ubicacion;
  error?: string;
};

// Resultado al obtener ubicaciones por ruta
export type GetUbicacionesResult = {
  ok: boolean;
  data?: Ubicacion[];
  error?: string;
};
