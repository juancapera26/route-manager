import type React from "react";
import type { FC } from "react";
interface InputProps {
    type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
    id?: string;
    name?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    min?: string;
    max?: string;
    step?: number;
    disabled?: boolean;
    success?: boolean;
    error?: boolean;
    hint?: string;
    required?: boolean;
    data_field?: string;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}
declare const Input: FC<InputProps>;
export default Input;
