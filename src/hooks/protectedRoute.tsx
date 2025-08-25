// src/hooks/protectedRoute.tsx
import { Navigate, Outlet } from "react-router";
import CustomLoader from "../components/customLoader/CustomLoader";
import useAuth from "./useAuth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  // Cambiamos 'loading' por 'authLoading' para que coincida con lo que devuelve el hook
  const { isAuthenticated, role, authLoading } = useAuth(); 

  // La condición ahora usa authLoading
  if (authLoading || (isAuthenticated && role === null)) {
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
