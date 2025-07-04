type SidebarContextType = {
    isExpanded: boolean;
    isMobileOpen: boolean;
    isHovered: boolean;
    activeItem: string | null;
    openSubmenu: string | null;
    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;
    setIsHovered: (isHovered: boolean) => void;
    setActiveItem: (item: string | null) => void;
    toggleSubmenu: (item: string) => void;
};
export declare const useSidebar: () => SidebarContextType;
export declare const SidebarProvider: React.FC<{
    children: React.ReactNode;
}>;
export {};
