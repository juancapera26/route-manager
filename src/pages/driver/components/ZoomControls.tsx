import { IconButton } from "@mui/material";

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControls: React.FC<Props> = ({ onZoomIn, onZoomOut }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <IconButton
      size="small"
      sx={{
        backgroundColor: "white",
        width: 40,
        height: 30,
        borderRadius: 2,
        boxShadow: 2,
        fontWeight: "bold",
        "&:hover": { backgroundColor: "#e0e0e0" },
      }}
      onClick={onZoomIn}
    >
      +
    </IconButton>
    <IconButton
      size="small"
      sx={{
        backgroundColor: "white",
        width: 40,
        height: 30,
        borderRadius: 2,
        boxShadow: 2,
        fontWeight: "bold",
        "&:hover": { backgroundColor: "#e0e0e0" },
      }}
      onClick={onZoomOut}
    >
      -
    </IconButton>
  </div>
);
