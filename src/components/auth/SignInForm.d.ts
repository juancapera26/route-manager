/**
2. src/components/auth/SignInForm.tsx
Este es el formulario de inicio de sesión. Su propósito es manejar la interfaz y la interacción del usuario.

import useLoginHook from "./hooks/LoginHook";: Esta línea es clave. El componente no tiene su propia lógica de estado (por ejemplo, el valor del email o la contraseña). En su lugar, usa un custom hook llamado useLoginHook.

const { ... } = useLoginHook();: Aquí, el componente llama al hook y extrae todas las variables de estado (email, password, error) y las funciones (setEmail, setPassword, handleLogin) que necesita para funcionar.

onChange={(e) => setEmail(e.target.value)}: Cuando el usuario escribe en el campo de email, esta línea llama a la función setEmail que viene del hook, actualizando el estado del email.

onSubmit={(e) => handleLogin(e, email, password, setError)}: Cuando el usuario hace clic en el botón de "Sign In", se llama a la función handleLogin que también viene del hook. Esta función es la que se encarga de la lógica de autenticación. */
export default function SignInForm(): import("react/jsx-runtime").JSX.Element;
