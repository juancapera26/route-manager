// Componente principal

// Importa utilidades de enrutamiento desde react-router
import { BrowserRouter as Router, Routes, Route } from "react-router";

// Importa un componente que protege rutas (solo accesibles si el usuario está logueado y con rol permitido).
import ProtectedRoute from "./hooks/protectedRoute";

// Importa páginas de autenticación (inicio de sesión, registro, restablecer contraseña)
import ResetPasswordForm from "./pages/AuthPages/ResetPasswordForm";
import ResetRequest from "./pages/AuthPages/ResetRequest";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

// Importa un layout general (estructura de la interfaz: header, sidebar, etc.)
import AppLayout from "./layout/AppLayout";

// Página de error 404 (cuando la ruta no existe)
import NotFound from "./pages/otherPages/NotFound";

// Páginas principales según rol de usuario
import { Home } from "./pages/home/Home";
import { Admin } from "./pages/admin/Admin";
import AppLayout_home from "./pages/home/layout_conductor/AppLayout_home";


// ---------------------
//  COMPONENTE PRINCIPAL
// ---------------------
// La función `App` es el corazón del frontend. Define todas las rutas disponibles.
function App() {
  return (
    // <Router>: envuelve toda la aplicación y habilita la navegación con historial del navegador.
    <Router basename="/">
      
      {/* <Routes>: agrupa todas las rutas de la aplicación */}
      <Routes>
        
        {/* ---------------------
            📌 RUTAS PÚBLICAS
        ---------------------- */}
        {/* Página de inicio de sesión (por defecto en "/") */}
        <Route path="/" element={<SignIn />} />

        {/* Alternativa explícita de inicio de sesión */}
        <Route path="/signin" element={<SignIn />} />
        
        {/* Registro de usuario */}
        <Route path="/signup" element={<SignUp />} />
        
        {/* Petición de restablecimiento de contraseña (usuario escribe su correo) */}
        <Route path="/reset-password" element={<ResetRequest />} />
        
        {/* Formulario para ingresar nueva contraseña tras recibir enlace/token */}
        <Route path="/reset-password-form" element={<ResetPasswordForm />} />


        {/* ---------------------
            🔒 RUTAS PROTEGIDAS (solo con login y rol específico)
        ---------------------- */}

        {/* Rutas exclusivas para usuarios con rol "1" (administradores) */}
        <Route element={<ProtectedRoute allowedRoles={["1"]} />}>
          
          {/* Layout general (barra lateral, header, etc.) para la zona de administración */}
          <Route path="/admin" element={<AppLayout />}>
            
            {/* Ruta índice dentro de /admin → muestra el dashboard de admin */}
            <Route index element={<Admin />} />
          </Route>
        </Route>

        {/* Rutas exclusivas para usuarios con rol "2" (conductores) */}
        <Route element={<ProtectedRoute allowedRoles={["2"]} />}>
          
          <Route path="/home" element={<AppLayout_home />}>
            
            <Route index element={<Home />} />
          </Route>
        </Route>


        {/* ---------------------
            ⚠️ RUTA DE FALLBACK
        ---------------------- */}
        {/* Cualquier ruta no definida → muestra página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Exporta App para usarla en src/main.tsx (punto de entrada).
export default App;