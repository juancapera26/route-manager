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

function App() {
  return (
    <Router basename="/">
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetRequest />} />
        <Route path="/reset-password-form" element={<ResetPasswordForm />} />

        {/* --- Rutas Protegidas para Admin (rol "1") --- */}
        <Route element={<ProtectedRoute allowedRoles={["1"]} />}>
          <Route path="/admin" element={<AppLayout />}>
            <Route index element={<Admin />} />
          </Route>
        </Route>

        {/* --- Rutas Protegidas para Usuario (rol "2") --- */}
        <Route element={<ProtectedRoute allowedRoles={["2"]} />}>
          
          <Route path="/home" element={<AppLayout_home />}>
            
            <Route index element={<Home />} />
          </Route>
        </Route>

        {/* --- Ruta de Not Found --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;