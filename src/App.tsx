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

// Páginas principales para el admin:
import Admin from "./pages/admin/Admin";
import AdminProfile from "./pages/profile/AdminProfile";
import PackagesManagement from "./pages/admin/PackagesManagement";
import DriversManagement from "./pages/admin/DriversManagement";
import VehiclesManagement from "./pages/admin/VehiclesManagement";
import DeliveryHistory from "./pages/admin/DeliveryHistory";
import RoutesManagement from "./pages/admin/RouteManagement";

// Páginas principales para el conductor:
import AppLayout_home from "./pages/driver/layout_conductor/AppLayout_home";
import DriverProfile from "./pages/profile/DriverProfile";

import { MapDriver } from "./pages/driver/MapDriver";
import { NoveltyManagement } from "./pages/admin/Novedad";
import ManualUsuario from "./components/header/ManualUsuario";

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
            <Route path="profile" element={<AdminProfile />} />
            <Route path="routes-management" element={<RoutesManagement />} />
            <Route
              path="packages-management"
              element={<PackagesManagement />}
            />
            <Route path="drivers-management" element={<DriversManagement />} />
            <Route
              path="vehicles-management"
              element={<VehiclesManagement />}
            />
            <Route path="delivery-history" element={<DeliveryHistory />} />
            <Route path="novedades" element={<NoveltyManagement />} />

            {/* ⭐ IMPORTANTE — Ruta para Admin del Manual de Usuario */}
            <Route path="manualusuario" element={<ManualUsuario />} />
          </Route>
        </Route>

        {/* --- Rutas Protegidas para Usuario (rol "2") --- */}
        <Route element={<ProtectedRoute allowedRoles={["2"]} />}>
          <Route path="/driver" element={<AppLayout_home />}>
            <Route index element={<MapDriver />} />
            <Route path="profile" element={<DriverProfile />} />

            {/* ⭐ Ruta para Conductor del Manual de Usuario */}
            <Route path="manualusuario" element={<ManualUsuario />} />
          </Route>
        </Route>

        {/* --- Ruta de Not Found --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
