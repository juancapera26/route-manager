interface RadioProps {
    id: string;
    name: string;
    value: string;
    checked: boolean;
    label: string;
    onChange: (value: string) => void;
    className?: string;
}
declare const RadioSm: React.FC<RadioProps>;
export default RadioSm;
