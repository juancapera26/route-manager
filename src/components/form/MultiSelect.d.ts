import type React from "react";
interface Option {
    value: string;
    text: string;
}
interface MultiSelectProps {
    label: string;
    options: Option[];
    defaultSelected?: string[];
    onChange?: (selected: string[]) => void;
    disabled?: boolean;
}
declare const MultiSelect: React.FC<MultiSelectProps>;
export default MultiSelect;
