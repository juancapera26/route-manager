import React, { createContext, useState, useContext, useEffect } from "react";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  type Theme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    const initialTheme = savedTheme ?? "light";
    setTheme(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // 📌 Crear el theme de MUI con soporte para modo oscuro
  const muiTheme: Theme = createTheme({
    palette: {
      mode: theme,
      background: {
        default: theme === "dark" ? "#1F2937" : "#ffffff",
        paper: theme === "dark" ? "#1F2937" : "#ffffff",
      },
      text: {
        primary: theme === "dark" ? "#ffffff" : "#000000",
        secondary: theme === "dark" ? "#d1d5db" : "#4b5563",
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: theme === "dark" ? "#1F2937" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: theme === "dark" ? "#1F2937" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: theme === "dark" ? "#1F2937" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
