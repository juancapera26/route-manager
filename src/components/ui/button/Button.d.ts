import { ReactNode } from "react";
interface ButtonProps {
    children: ReactNode;
    size?: "sm" | "md";
    variant?: "primary" | "outline";
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
