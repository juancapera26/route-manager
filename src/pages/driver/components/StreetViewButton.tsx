import { IconButton } from "@mui/material";
import { useCallback } from "react";

interface Props {
  location: google.maps.LatLngLiteral | null;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

export const StreetViewButton: React.FC<Props> = ({ location, mapRef }) => {
  const handleClick = useCallback(() => {
    if (!mapRef.current || !location) {
      console.warn("No se puede abrir Street View: faltan datos.");
      return;
    }

    const panorama = new google.maps.StreetViewPanorama(
      document.getElementById("map") as HTMLElement,
      {
        position: location,
        pov: { heading: 34, pitch: 10 },
        zoom: 1,
      }
    );

    mapRef.current.setStreetView(panorama);
  }, [location, mapRef]);

  return (
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
      onClick={handleClick}
    >
      <svg width={20} height={20} viewBox="0 0 24 24">
        <circle cx="12" cy="7" r="4" fill="#1976d2" />
        <rect x="9" y="12" width="6" height="8" rx="3" fill="#1976d2" />
      </svg>
    </IconButton>
  );
};
