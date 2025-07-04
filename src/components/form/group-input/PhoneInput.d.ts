interface PhoneInputProps {
    placeholder?: string;
    onChange?: (phoneNumber: string) => void;
    selectPosition?: "start" | "end";
    value?: string;
    disabled?: boolean;
    success?: boolean;
    error?: boolean;
    className?: string;
    isEditing?: boolean;
}
declare const PhoneInput: React.FC<PhoneInputProps>;
export default PhoneInput;
