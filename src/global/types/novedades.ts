export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
}

export interface Novedad {
  id_novedad: number;
  descripcion: string;
  tipo: string;
  fecha: string; 
  id_usuario: number;
  imagen?: string;
  usuario: Usuario;
}