import { IconButton } from "@mui/material";

interface Props {
  onClick: () => void;
}

export const StreetViewButton: React.FC<Props> = ({ onClick }) => (
  <IconButton
    size="small"
    sx={{
      backgroundColor: "white",
      width: 40,
      height: 40,
      borderRadius: "8px",
      boxShadow: 2,
      "&:hover": { backgroundColor: "#e0e0e0" },
    }}
    onClick={onClick}
  >
    <svg width={20} height={20} viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" fill="#1976d2" />
      <rect x="9" y="12" width="6" height="8" rx="3" fill="#1976d2" />
    </svg>
  </IconButton>
);
