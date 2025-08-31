import React from "react";
type ThemeMode = "light" | "dark";
type ThemeContextType = {
    theme: ThemeMode;
    toggleTheme: () => void;
};
export declare const ThemeProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useTheme: () => ThemeContextType;
export {};
