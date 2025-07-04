interface RadioProps {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    label: string;
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
}
declare const Radio: React.FC<RadioProps>;
export default Radio;
