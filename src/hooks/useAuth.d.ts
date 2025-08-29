import { type User } from "firebase/auth";
export interface RegisterData {
    nombre: string;
    apellido: string;
    documento: string;
    numeroTelefono: string;
    email: string;
    confirmarEmail: string;
    password: string;
    repetirPassword: string;
    tipoVehiculo: string;
}
declare const useAuth: () => {
    authLoading: boolean;
    handleLogin: (e: {
        preventDefault: () => void;
    }, email: string, password: string, setError: React.Dispatch<React.SetStateAction<string>>) => Promise<void>;
    handleRegister: (registerData: RegisterData, setError: React.Dispatch<React.SetStateAction<string>>, setSuccess?: React.Dispatch<React.SetStateAction<string>>) => Promise<void>;
    logout: () => Promise<void>;
    handlePasswordReset: (email: string, setError: React.Dispatch<React.SetStateAction<string>>, setMessage: React.Dispatch<React.SetStateAction<string>>) => Promise<void>;
    getAccessToken: () => Promise<string | null>;
    user: User | null;
    role: string | null;
    nombre: string | null;
    apellido: string | null;
    correo: string | null;
    isAuthenticated: boolean;
};
export default useAuth;
