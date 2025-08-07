// src/hooks/protectedRoute.tsx
import { Navigate, Outlet } from "react-router";
import CustomLoader from "../components/customLoader/CustomLoader";
import useAuth from "./useAuth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role, loading } = useAuth();

  // Mientras carga el usuario o el rol, muestra loader
  if (loading || (isAuthenticated && role === null)) {
    return <CustomLoader />;
  }

  // Si no está autenticado, redirige a login
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Si el rol no está permitido, redirige
  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/" replace />;
  }

  // Si todo bien, renderiza la ruta hija
  return <Outlet />;
};

export default ProtectedRoute;
