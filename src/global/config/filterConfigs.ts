import { OpcionesFiltro } from '../../hooks/useEstadoFilter';
import { PaquetesEstados, Paquete } from '../types/paquete.types';

// ===================== Configuración para Paquetes =====================
export const opcionesFiltorPaquetes: OpcionesFiltro<PaquetesEstados> = [
  { valor: null, etiqueta: 'Todos' },
  { valor: PaquetesEstados.Pendiente, etiqueta: 'Pendientes' },
  { valor: PaquetesEstados.Asignado, etiqueta: 'Asignados' },
  { valor: PaquetesEstados.EnRuta, etiqueta: 'En Ruta' },
  { valor: PaquetesEstados.Entregado, etiqueta: 'Entregados' },
  { valor: PaquetesEstados.Fallido, etiqueta: 'Fallidos' }
];

export const obtenerEstadoPaquete = (paquete: Paquete): PaquetesEstados => 
  paquete.estado;