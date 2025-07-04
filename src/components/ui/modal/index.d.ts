interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
    isFullscreen?: boolean;
}
export declare const Modal: React.FC<ModalProps>;
export {};
