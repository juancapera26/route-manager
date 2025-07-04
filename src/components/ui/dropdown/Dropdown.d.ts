import type React from "react";
interface DropdownProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}
export declare const Dropdown: React.FC<DropdownProps>;
export {};
