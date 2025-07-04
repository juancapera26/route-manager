declare const ResetPasswordFormHook: () => {
    verified: boolean;
    newPassword: string;
    message: string;
    loading: boolean;
    newPasswordConfirm: string;
    showPassword: boolean;
    showPasswordConfirm: boolean;
    setShowPasswordConfirm: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    setShowPassword: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    handleReset: (e: React.FormEvent) => Promise<void>;
    setNewPassword: import("react").Dispatch<import("react").SetStateAction<string>>;
    setNewPasswordConfirm: import("react").Dispatch<import("react").SetStateAction<string>>;
};
export default ResetPasswordFormHook;
