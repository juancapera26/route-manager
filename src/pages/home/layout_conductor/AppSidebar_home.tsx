import React, { useState } from "react";
import { useLocation, Link } from "react-router";
import PlaceIcon from "@mui/icons-material/Place";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSidebar } from "../../../context/SidebarContext";

import ModalHistorial from "../ModalHistorial";
import { HorizontaLDots } from "../../../icons";

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

// otherItems si no se usan, se elimina para limpiar

const AppSidebar: React.FC = () => {
  const [isHistorialPanelOpen, setHistorialPanelOpen] = useState(false);
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const IconStudyImpetus = "/public/images/logo/logo.png";

  const navItems: NavItem[] = [
    {
      icon: <PlaceIcon />,
      name: "Rutas",
      path: "/",
    },
    {
      name: "Historial",
      icon: <ArticleIcon />,
      action: () => setHistorialPanelOpen((prev) => !prev),
    },
    {
      name: "indefinido",
      icon: <ArrowBackIcon />,
      path: "/campaigns",
    },
  ];

  // Se elimina manejo de submenus y referencias (a menos que uses subitems)

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
              className={`menu-item group hover:text-primary hover:font-outfit ${
                isActive(nav.path)
                  ? "text-primary font-bold bg-primary/10"
                  : "menu-item-inactive"
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
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 
          text-gray-900 dark:text-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
          ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}
          ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex w-full h-[76.5px] justify-center align-middle items-center border-b 
          bg-primary bg-gradient-to-r from-primaryDark via-primary to-primaryDark"
        >
          <img
            src={IconStudyImpetus}
            className={`${isExpanded || isHovered ? "h-20" : "h-10"}`}
            alt="Logo"
          />
        </div>
        <div className="px-5 pt-5 flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2
                  className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-300 ${
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

      <ModalHistorial
        isOpen={isHistorialPanelOpen}
        onClose={() => setHistorialPanelOpen(false)}
        isExpanded={isExpanded}
        isHovered={isHovered}
        isMobileOpen={isMobileOpen}
      />
    </>
  );
};

export default AppSidebar;
