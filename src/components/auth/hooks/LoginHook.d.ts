/**
3. src/components/auth/hooks/LoginHook.ts
Este archivo es el custom hook que maneja la lógica del formulario. Se separa la lógica de la interfaz para que sea más fácil de reutilizar y mantener.

import useAuth from '../../../hooks/useAuth';: Aquí está la pieza que conecta todo. Este hook importa otro hook más general, useAuth, que es el que probablemente contiene la lógica central de autenticación con Firebase.

const [email, setEmail] = useState('');: Aquí se definen los estados locales para los campos del formulario. Esto es lo que permite que el componente SignInForm sepa qué valor tiene el email o la contraseña.

const { handleLogin } = useAuth();: Se extrae la función handleLogin del hook useAuth.

return { ... };: El hook devuelve todas las variables y funciones que el componente SignInForm necesita.
*/
declare const useLoginHook: () => {
    email: string;
    password: string;
    error: string;
    showPassword: boolean;
    isChecked: boolean;
    setPassword: import("react").Dispatch<import("react").SetStateAction<string>>;
    setEmail: import("react").Dispatch<import("react").SetStateAction<string>>;
    setError: import("react").Dispatch<import("react").SetStateAction<string>>;
    handleLogin: (e: {
        preventDefault: () => void;
    }, email: string, password: string, setError: React.Dispatch<React.SetStateAction<string>>) => Promise<void>;
    setShowPassword: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setIsChecked: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
export default useLoginHook;
