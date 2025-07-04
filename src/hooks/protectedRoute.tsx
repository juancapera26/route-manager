
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig'; // Asegúrate de importar tu instancia de auth
import { Navigate, Outlet } from 'react-router';
import CustomLoader from '../components/customLoader/CustomLoader';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Escucha los cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // Usuario autenticado
      } else {
        setIsAuthenticated(false); // Usuario no autenticado
      }
    });

    // Limpieza de la suscripción
    return () => unsubscribe();
  }, []);

  // Mientras no se sepa si está autenticado, muestra un loading o nada
  if (isAuthenticated === null) {
    return <CustomLoader />; // Puedes mostrar un spinner o similar aquí
  }

  if (isAuthenticated) {
  
    return <Outlet />; // Si está autenticado, permite el acceso a las rutas protegidas
  } else {
    return <Navigate to="/signin" replace />; // Si no está autenticado, redirige al login
  }
};

export default ProtectedRoute;
