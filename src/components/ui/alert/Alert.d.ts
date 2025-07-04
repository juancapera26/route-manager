interface AlertProps {
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    showLink?: boolean;
    linkHref?: string;
    linkText?: string;
}
declare const Alert: React.FC<AlertProps>;
export default Alert;
