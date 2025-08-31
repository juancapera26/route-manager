// Punto de entrada
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Toaster } from "sonner";
import { AppWrapper } from "./components/common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";

// createRoot crea la "raíz" de la aplicación, que es el punto donde se renderizará el HTML.
// Se busca el elemento con ID 'root' en el archivo `index.html`.
createRoot(document.getElementById("root")!).render(
  // <StrictMode> es una herramienta de desarrollo de React.
  // No afecta el build de producción, solo ayuda a detectar problemas potenciales.
  <StrictMode>
    {/* <ThemeProvider> es un 'Context Provider' que hace el estado del tema (claro/oscuro)
        accesible para todos los componentes hijos, sin pasar props manualmente. */}
    <ThemeProvider>
      {/* <AppWrapper> es otro 'Context Provider' que probablemente maneja metadatos de la página.
          En el archivo de estructura que enviaste, se encuentra en `components/common/PageMeta`. */}
      <AppWrapper>
        {/* <App /> es el componente principal que definimos en `App.tsx`.
            Aquí se renderiza toda la estructura de nuestra aplicación. */}
        <App />
        {/* <Toaster> es un componente que muestra notificaciones (toasts).
            Se incluye aquí para que las notificaciones puedan ser llamadas desde cualquier parte de la aplicación. */}
        <Toaster position="bottom-center" richColors />
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>
);