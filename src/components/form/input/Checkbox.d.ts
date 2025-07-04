interface CheckboxProps {
    label?: string;
    checked: boolean;
    className?: string;
    id?: string;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}
declare const Checkbox: React.FC<CheckboxProps>;
export default Checkbox;
