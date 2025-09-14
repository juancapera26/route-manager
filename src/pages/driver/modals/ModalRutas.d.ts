import React from "react";
interface ModalRutasProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}
declare const ModalRutas: React.FC<ModalRutasProps>;
export default ModalRutas;
