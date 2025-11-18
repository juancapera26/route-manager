import React, { useState } from "react";
import { useLocation, Link } from "react-router";
import PlaceIcon from "@mui/icons-material/Place";
import ArticleIcon from "@mui/icons-material/Article";
import InfoIcon from "@mui/icons-material/Info";
import { useSidebar } from "../../../context/SidebarContext";
import { HorizontaLDots } from "../../../icons";
import ModalHistorial from "../modals/ModalHistorial";
import ModalReporte from "../modals/ModalReporte";
import ModalRutas from "../modals/ModalRutas";

type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
  subItems?: SubItem[];
};

const AppSidebar: React.FC = () => {
  const [openModal, setOpenModal] = useState<
    "rutas" | "historial" | "reporte" | null
  >(null);

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const IconStudyImpetus = "/images/logo/logo.png";
  const IconResponsive = "/images/logo/logo_responsive.png";

  const navItems: NavItem[] = [
    {
      icon: <PlaceIcon className="menu-item-icon-size fill-current" />,
      name: "Rutas",
      action: () => setOpenModal((prev) => (prev === "rutas" ? null : "rutas")),
    },
    {
      name: "Historial",
      icon: <ArticleIcon className="menu-item-icon-size fill-current" />,
      action: () =>
        setOpenModal((prev) => (prev === "historial" ? null : "historial")),
    },
    {
      name: "Reporte",
      icon: <InfoIcon className="menu-item-icon-size fill-current" />,
      action: () =>
        setOpenModal((prev) => (prev === "reporte" ? null : "reporte")),
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          {nav.action ? (
            <button
              onClick={nav.action}
              className="menu-item group cursor-pointer flex items-center gap-3 text-gray-900 dark:text-white"
            >
              <span className="menu-item-icon-size">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text text-gray-900 dark:text-white">
                  {nav.name}
                </span>
              )}
            </button>
          ) : nav.path ? (
            <Link
              to={nav.path}
              className={`menu-item group flex items-center gap-2 p-2 rounded-lg ${
                isActive(nav.path)
                  ? "bg-gray-100 dark:bg-gray-800 dark:text-gray-300 font-bold"
                  : "text-gray-700 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-300"
              } text-gray-900 dark:text-white`}
            >
              <span
                className={`${
                  isActive(nav.path)
                    ? "text-primary font-bold hover:font-outfit"
                    : "text-gray-500"
                } text-gray-900 dark:text-white`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text text-gray-900 dark:text-white">
                  {nav.name}
                </span>
              )}
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <aside
        className={`fixed flex flex-col top-0 left-0 bottom-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 transition-all duration-300 z-50 border-r border-gray-200
          ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
          ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex justify-center items-center bg-white dark:bg-gray-900"
        >
                  <img
          src={
            isExpanded || isHovered || isMobileOpen
              ? IconStudyImpetus
              : IconResponsive
          }
          alt="Logo"
          className={`mt-5 mb-4 transition-all ${
            isExpanded || isHovered || isMobileOpen ? "h-16" : "h-10"
          }`}
        />
        </div>
        <div className="px-5 pt-5 flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "Menu"
              ) : (
                <HorizontaLDots className="size-6" />
              )}
            </h2>
                {renderMenuItems(navItems)}
              </div>
            </div>
          </nav>
        </div>
      </aside>

      <ModalRutas
        isOpen={openModal === "rutas"}
        onClose={() => setOpenModal(null)}
        isExpanded={isExpanded}
        isHovered={isHovered}
        isMobileOpen={isMobileOpen}
      />

      <ModalHistorial
        isOpen={openModal === "historial"}
        onClose={() => setOpenModal(null)}
        isExpanded={isExpanded}
        isHovered={isHovered}
        isMobileOpen={isMobileOpen}
      />

      <ModalReporte
        isOpen={openModal === "reporte"}
        onClose={() => setOpenModal(null)}
      />
    </>
  );
};

export default AppSidebar;
