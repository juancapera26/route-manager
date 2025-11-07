import { IconButton } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

interface Props {
  googleMap: google.maps.Map | null;
  getUserLocation: () => void;
  location: google.maps.LatLngLiteral | null; // Cambiar center a location
  userMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
  onFollow?: () => void; 
}

export const LocateButton: React.FC<Props> = ({
  googleMap,
  getUserLocation,
  location, 
  userMarkerRef,
  onFollow,
}) => {
  const handleClick = () => {
    getUserLocation();
    if (location && googleMap) {
      googleMap.panTo(location);
      googleMap.setZoom(15);
      if (userMarkerRef.current) {
        userMarkerRef.current.setPosition(location);
      }
    }
    if (onFollow) onFollow();
  };

  return (
    <IconButton
      color="primary"
      onClick={handleClick}
      sx={{
        backgroundColor: "white",
        "&:hover": { backgroundColor: "#e0e0e0" },
        boxShadow: 3,
        borderRadius: "50%",
        width: 48,
        height: 48,
      }}
    >
      <MyLocationIcon />
    </IconButton>
  );
};
