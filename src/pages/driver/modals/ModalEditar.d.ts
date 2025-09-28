// driver/modals/ModalEditar.d.ts

export interface Conductor {
  nombre: string;
  apellido: string;
  documento: string;
  telefono_movil: string;
  correo: string;
}

export interface ModalEditarProps {
  isOpen: boolean;
  onClose: () => void;
  conductor: Conductor | null;
  onSave: (data: Partial<Conductor>) => Promise<void>;
}
