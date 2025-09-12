import { NavLink } from "react-router";
import { Bell } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { HorizontaLDots } from "../icons";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddBoxIcon from "@mui/icons-material/AddBox";
import {
  Home,
  Assessment,
  Inventory2,
  LocalShipping,
  Groups2 as Groups2Icon,
  History,
} from "@mui/icons-material";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: <Home className="menu-item-icon-size fill-current" />,
    name: "Dashboard",
    path: "/admin",
  },
  {
    icon: <Assessment className="menu-item-icon-size fill-current" />,
    name: "Monitoreo operativo",
    path: "/admin/operational-monitoring",
  },
  {
    icon: <LocationOnIcon className="menu-item-icon-size" />,
    name: "Gestión de rutas",
    path: "/admin/routes-management",
  },
  {
    icon: <Inventory2 className="menu-item-icon-size fill-current" />,
    name: "Gestión de paquetes",
    path: "/admin/packages-management",
  },
  {
    icon: <Groups2Icon className="menu-item-icon-size fill-current" />,
    name: "Gestión de conductores",
    path: "/admin/drivers-management",
  },
  {
    icon: <LocalShipping className="menu-item-icon-size" />,
    name: "Gestión de vehículos",
    path: "/admin/vehicles-management",
  },
  {
    icon: <History className="menu-item-icon-size fill-current" />,
    name: "Historial de entregas",
    path: "/admin/delivery-history",
  },
  {
    icon: <Bell className="menu-item-icon-size fill-current" />,
    name: "Novedades",
    path: "/admin/updates",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const IconStudyImpetus = "/images/logo/logo.png";
  const IconResponsive = "/images/logo/logo_responsive.png";
  

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          <NavLink
            to={nav.path}
            end={nav.path === "/admin"}
            className={({ isActive }) =>
              `menu-item group flex items-center gap-2 p-2 rounded-lg ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 dark:text-gray-300 font-bold"
                  : "text-gray-700 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              } ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`
            }
          >
            <span className="menu-item-icon-size">{nav.icon}</span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text max-w-[200px] truncate">
                {nav.name}
              </span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed flex flex-col top-0 left-0 bottom-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 transition-all duration-300 z-50 border-r border-gray-200
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
          src={isExpanded || isHovered || isMobileOpen ? IconStudyImpetus : IconResponsive}
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
            {renderMenuItems(navItems)}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
