type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";
interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    color?: BadgeColor;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    children: React.ReactNode;
}
declare const Badge: React.FC<BadgeProps>;
export default Badge;
