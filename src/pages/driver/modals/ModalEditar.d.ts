// driver/modals/ModalEditar.d.ts

export interface Conductor {
  id_usuario: number;
  nombre: string;
  apellido: string;
  documento: string;
  tipo_documento: string;
  telefono_movil: string;
  correo: string;
  id_rol: number;
}

export interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  conductor: Conductor | null;
  onSave: (data: Partial<Conductor>) => Promise<void>;
}
