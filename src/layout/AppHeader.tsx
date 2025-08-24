import { useEffect, useRef } from "react";

import MenuIcon from '@mui/icons-material/Menu';
import UserDropdown from "../components/header/UserDropdown";
import { useSidebar } from "../context/SidebarContext";

// import { Link } from "react-router";


// import NotificationDropdown from "../components/header/NotificationDropdown";


const AppHeader: React.FC = () => {
  // const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  
  const handleToggle = () => {
    if (window.innerWidth >= 991) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  // const toggleApplicationMenu = () => {
  //   setApplicationMenuOpen(!isApplicationMenuOpen);
  // };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white z-99999 dark:border-primaryDark dark:bg-primaryDark lg:border-b backdrop-blur-sm">
      <div className="flex flex-col items-center justify-between flex-grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-300 rounded-lg z-99999 lg:flex lg:h-11 lg:w-11"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            <MenuIcon/>
          </button>
         
          <div className="ml-auto">
          <UserDropdown />
        </div>
        </div>
        
      </div>
    </header>
  );
};

export default AppHeader;
