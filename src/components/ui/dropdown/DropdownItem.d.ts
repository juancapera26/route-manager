import type React from "react";
interface DropdownItemProps {
    tag?: "a" | "button";
    to?: string;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: () => void;
    onItemClick?: () => void;
    baseClassName?: string;
    className?: string;
    children: React.ReactNode;
}
export declare const DropdownItem: React.FC<DropdownItemProps>;
export {};
