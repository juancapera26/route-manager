import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router"; // 👈 corregido
import {
  BoxCubeIcon,
  ChevronDownIcon,
  HorizontaLDots,
  PieChartIcon,
  PlugInIcon,
} from "../icons";

import BusinessIcon from "@mui/icons-material/Business";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import Groups2Icon from "@mui/icons-material/Groups2";
import HomeIcon from "@mui/icons-material/Home";
import PhonelinkIcon from "@mui/icons-material/Phonelink";
import { BellIcon } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  { icon: <HomeIcon />, name: "Dashboard", path: "/admin" },
  {
    name: "Monitoreo operativo",
    icon: <Groups2Icon />,
    path: "operational-monitoring",
  },
  {
    name: "Gestión de rutas",
    icon: <Groups2Icon />,
    path: "routes-management",
  },
  {
    name: "Gestión de paquetes",
    icon: <Groups2Icon />,
    path: "packages-management",
  },
  {
    name: "Gestión de conductores",
    icon: <Diversity3Icon />,
    path: "drivers-management",
  },
  {
    name: "Gestión de vehiculos",
    icon: <BusinessIcon />,
    path: "vehicles-management",
  },
  {
    name: "Registrar paquetes",
    icon: <BusinessIcon />,
    path: "register-packages",
  },
  {
    name: "Historial de entregas",
    icon: <PhonelinkIcon />,
    path: "delivery-history",
  },
  { name: "Novedades", icon: <BellIcon />, path: "updates" },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const IconStudyImpetus = "/images/logo/logo.png"; // 👈 usa public/images

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight ?? 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span className="menu-item-icon-size text-primary">
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-primary"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <NavLink
                to={nav.path}
                end={nav.path === "/admin"} // 👈 solo exacto en dashboard
                className={({ isActive }) =>
                  `menu-item group ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800 dark:text-gray-400 font-bold"
                      : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-400"
                  }`
                }
              >
                <span>{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </NavLink>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <NavLink
                      to={subItem.path}
                      className={({ isActive }) =>
                        `menu-dropdown-item ${
                          isActive
                            ? "text-primary font-semibold"
                            : "text-gray-500 hover:text-primary"
                        }`
                      }
                    >
                      {subItem.name}
                      {subItem.new && (
                        <span className="menu-dropdown-badge">new</span>
                      )}
                      {subItem.pro && (
                        <span className="menu-dropdown-badge">pro</span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed flex flex-col top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-center items-center bg-white dark:bg-gray-900">
        <img
          src={IconStudyImpetus}
          alt="Logo"
          className={`mt-2 mb-4 transition-all ${
            isExpanded || isHovered || isMobileOpen ? "h-16" : "h-10"
          }`}
        />
      </div>

      <div className="px-5 pt-5 flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
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
            {renderMenuItems(navItems, "main")}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
