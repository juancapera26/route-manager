import { IconButton } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

interface Props {
  googleMap: google.maps.Map | null;
  getUserLocation: () => void;
  center: google.maps.LatLngLiteral | null;
  userMarkerRef: React.MutableRefObject<google.maps.Marker | null>;
}

export const LocateButton: React.FC<Props> = ({
  googleMap,
  getUserLocation,
  center,
  userMarkerRef,
}) => {
  const handleClick = () => {
    getUserLocation();
    if (center && googleMap) {
      googleMap.panTo(center);
      googleMap.setZoom(15);
      if (userMarkerRef.current) {
        userMarkerRef.current.setPosition(center);
      }
    }
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
