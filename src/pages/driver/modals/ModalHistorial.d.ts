import React from "react";
interface ModalHistorialProps {
    isOpen: boolean;
    onClose: () => void;
    isExpanded: boolean;
    isHovered: boolean;
    isMobileOpen: boolean;
}
declare const ModalHistorial: React.FC<ModalHistorialProps>;
export default ModalHistorial;
