import { FC, ReactNode, FormEvent } from "react";
interface FormProps {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
    className?: string;
}
declare const Form: FC<FormProps>;
export default Form;
