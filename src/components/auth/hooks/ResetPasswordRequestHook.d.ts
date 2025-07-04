declare const ResetPasswordRequestHook: () => {
    error: string;
    message: string;
    email: string;
    loading: boolean;
    handleResetPassword: (e: React.FormEvent) => Promise<void>;
    setEmail: import("react").Dispatch<import("react").SetStateAction<string>>;
    setLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
export default ResetPasswordRequestHook;
