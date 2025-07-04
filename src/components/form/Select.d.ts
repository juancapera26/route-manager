interface Option {
    value: string;
    label: string;
}
interface SelectProps {
    options: Option[];
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
    defaultValue?: string;
    disabledSelectOption?: boolean;
}
declare const Select: React.FC<SelectProps>;
export default Select;
