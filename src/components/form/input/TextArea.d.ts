import React from "react";
interface TextareaProps {
    placeholder?: string;
    rows?: number;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    hint?: string;
}
declare const TextArea: React.FC<TextareaProps>;
export default TextArea;
