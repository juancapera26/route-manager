import { Box } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

export const CarMarker = () => (
  <Box
    sx={{
      backgroundColor: "#1976d2",
      border: "2px solid white",
      borderRadius: "50%",
      width: 40,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: 3,
    }}
  >
    <DirectionsCarIcon sx={{ color: "white" }} />
  </Box>
);
