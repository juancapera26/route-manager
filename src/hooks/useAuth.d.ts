import { type User } from "firebase/auth";
declare const useAuth: () => {
    loading: boolean;
    handleLogin: (e: {
        preventDefault: () => void;
    }, email: string, password: string, setError: React.Dispatch<React.SetStateAction<string>>) => Promise<void>;
    logout: () => Promise<void>;
    handlePasswordReset: (email: string, setError: React.Dispatch<React.SetStateAction<string>>, setMessage: React.Dispatch<React.SetStateAction<string>>) => Promise<void>;
    getAccessToken: () => Promise<string | null>;
    user: User | null;
    role: string | null;
    nombre: string | null;
    apellido: string | null;
    isAuthenticated: boolean;
};
export default useAuth;
