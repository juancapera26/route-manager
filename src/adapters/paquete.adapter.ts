// adapters/paquete.adapter.ts
import { Paquete, TipoPaquete, PaquetesEstados } from "../global/types/paquete.types";
//Adapta el backend a los del front
interface PaqueteFromAPI {
  id_paquete: number;
  codigo_rastreo?: string | null;
  fecha_registro: string;
  fecha_entrega?: string | null;
  estado_paquete: string;
  largo: number;
  ancho: number;
  alto: number;
  peso: number;
  id_cliente: number;
  id_ruta?: number | null;
  id_barrio?: number | null;
  direccion_entrega?: string | null;
  tipo_paquete: string;
  lat?: number | null;
  lng?: number | null;
  valor_declarado: number;
  cantidad: number;
  
  cliente?: {
    id_cliente: number;
    nombre: string;
    apellido: string;
    direccion: string;
    correo: string;
    telefono_movil: string;
  };
  
  ruta?: {
    id_ruta: number;
    nombre?: string;
    descripcion?: string;
    estado_ruta: string;
    conductor?: {
      id_conductor: number;
      nombre: string;
      apellido: string;
    };
  };
  
  barrio?: {
    id_barrio: number;
    nombre: string;
  };
}

const mapEstadoPaquete = (estado: string): PaquetesEstados => {
  const estadoMap: Record<string, PaquetesEstados> = {
    'Pendiente': PaquetesEstados.Pendiente,
    'Asignado': PaquetesEstados.Asignado,
    'Entregado': PaquetesEstados.Entregado,
    'Fallido': PaquetesEstados.Fallido,
  };
  return estadoMap[estado] || PaquetesEstados.Pendiente;
};

const mapTipoPaquete = (tipo: string): TipoPaquete => {
  const tipoMap: Record<string, TipoPaquete> = {
    'Pequeno': TipoPaquete.Pequeño,
    'Mediano': TipoPaquete.Mediano,
    'Grande': TipoPaquete.Grande,
    'Refrigerado': TipoPaquete.Refrigerado,
    'Fragil': TipoPaquete.Fragil,
  };
  return tipoMap[tipo] || TipoPaquete.Mediano;
};

// ✅ Adapter corregido - sin objeto dimensiones
export function mapApiToPaquete(apiResponse: PaqueteFromAPI): Paquete {
  return {
    id_paquete: apiResponse.id_paquete,
    codigo_rastreo: apiResponse.codigo_rastreo,
    fecha_registro: apiResponse.fecha_registro,
    fecha_entrega: apiResponse.fecha_entrega,
    estado: mapEstadoPaquete(apiResponse.estado_paquete),
    tipo_paquete: mapTipoPaquete(apiResponse.tipo_paquete),
    
    // ← CAMBIO: Dimensiones como propiedades directas
    largo: apiResponse.largo,
    ancho: apiResponse.ancho,
    alto: apiResponse.alto,
    peso: apiResponse.peso,
    
    cantidad: apiResponse.cantidad,
    valor_declarado: apiResponse.valor_declarado,
    
    direccion_entrega: apiResponse.direccion_entrega,
    lat: apiResponse.lat,
    lng: apiResponse.lng,
    
    id_cliente: apiResponse.id_cliente,
    id_ruta: apiResponse.id_ruta,
    id_barrio: apiResponse.id_barrio,
    
    cliente: apiResponse.cliente,
    ruta: apiResponse.ruta, // ← AGREGADO
    barrio: apiResponse.barrio,
  };
}