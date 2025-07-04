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
