# src/hooks: Aquí se encuentran los componentes reutilizables.


#### **hooks/** - Lógica Reutilizable

- ```useAuth``` - Este es importantísimo. Probablemente maneja toda la lógica para saber si un usuario está autenticado, quién es el usuario actual, etc. Cualquier componente que necesite saber si el usuario inició sesión usará este hook.
- ```protectedRoute``` - Es un mecanismo (probablemente un Componente de Orden Superior o un layout) que protege las rutas. Usa useAuth para verificar si el usuario tiene permiso para ver una página (como Admin.tsx) y si no, lo redirige al login.
- ```Hooks``` para reset de contraseña