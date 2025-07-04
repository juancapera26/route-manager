import type { FC, ReactNode } from "react";
interface LabelProps {
    htmlFor?: string;
    children: ReactNode;
    className?: string;
}
declare const Label: FC<LabelProps>;
export default Label;
