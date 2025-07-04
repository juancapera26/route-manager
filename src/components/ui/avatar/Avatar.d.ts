interface AvatarProps {
    src: string;
    alt?: string;
    size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
    status?: "online" | "offline" | "busy" | "none";
}
declare const Avatar: React.FC<AvatarProps>;
export default Avatar;
