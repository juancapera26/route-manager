import { FC } from "react";
interface FileInputProps {
    className?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
declare const FileInput: FC<FileInputProps>;
export default FileInput;
