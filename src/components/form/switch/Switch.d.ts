interface SwitchProps {
    label: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    color?: "blue" | "gray";
}
declare const Switch: React.FC<SwitchProps>;
export default Switch;
