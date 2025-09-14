import { useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useUserLocation } from "./hooks/useUserLocation";
import { useRoute } from "./hooks/useRoute";
import { LocateButton } from "./components/LocateButton";
import { StreetViewButton } from "./components/StreetViewButton";
import { ZoomControls } from "./components/ZoomControls";
import { Box } from "@mui/material";

interface DriverProps {
  destino?: string | null;
}

const libraries: "places"[] = ["places"];

// 🔹 Ícono circular azul con carro blanco
const carCircleIcon = {
  url:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="#1976d2" stroke="white" stroke-width="2"/>
        <path d="M12 23h1.5v1.5a1.5 1.5 0 003 0V23h3v1.5a1.5 1.5 0 003 0V23H24a1 1 0 001-1v-4l-1.5-4.5a1.5 1.5 0 00-1.5-1.2h-9a1.5 1.5 0 00-1.5 1.2L10 18v4a1 1 0 001 1zm1-6l1-3h8l1 3h-10z" fill="white"/>
      </svg>
    `),
  scaledSize: { width: 36, height: 36 },
  anchor: { x: 18, y: 18 },
} as google.maps.Icon;

export const Driver: React.FC<DriverProps> = ({ destino }) => {
  const { center, getUserLocation } = useUserLocation();
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const { requestRoute } = useRoute(
    mapRef.current,
    directionsRendererRef.current
  );

  // 🔹 Helper para zoom suave
  const smoothZoom = (level: number) => {
    if (!mapRef.current) return;
    mapRef.current.panTo(mapRef.current.getCenter()!);
    mapRef.current.setZoom(level);
  };

  useEffect(() => {
    if (!isLoaded || !center) return;

    if (!mapRef.current) {
      const mapElement = document.getElementById("map") as HTMLElement;
      if (!mapElement) {
        console.error("No se encontró el div con id='map'");
        return;
      }

      mapRef.current = new google.maps.Map(mapElement, {
        center,
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: false, // quitamos botones nativos
        scrollwheel: true, // 👈 habilitamos scroll/gestos
      });

      directionsRendererRef.current = new google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(mapRef.current);

      userMarkerRef.current = new google.maps.Marker({
        position: center,
        map: mapRef.current,
        icon: carCircleIcon,
      });
    } else {
      mapRef.current.panTo(center);
      if (userMarkerRef.current) {
        userMarkerRef.current.setPosition(center);
      }
    }
  }, [isLoaded, center]);

  useEffect(() => {
    if (destino && center) {
      requestRoute(center, destino);
    }
  }, [destino, center]);

  useEffect(() => {
    getUserLocation();
  }, []);

  if (!isLoaded) {
    return <div>Cargando mapa...</div>;
  }

  return (
    <Box sx={{ position: "relative", width: "100%", height: "89vh" }}>
      <Box id="map" sx={{ width: "100%", height: "100%" }} />

      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <LocateButton
          googleMap={mapRef.current}
          getUserLocation={getUserLocation}
          center={center}
          userMarkerRef={userMarkerRef}
        />

        <StreetViewButton
          onClick={() => {
            if (!mapRef.current || !center) return;
            const panorama = new google.maps.StreetViewPanorama(
              document.getElementById("map") as HTMLElement,
              {
                position: center,
                pov: { heading: 34, pitch: 10 },
                zoom: 1,
              }
            );
            mapRef.current.setStreetView(panorama);
          }}
        />

        <ZoomControls
          onZoomIn={() => smoothZoom((mapRef.current?.getZoom() || 15) + 1)}
          onZoomOut={() => smoothZoom((mapRef.current?.getZoom() || 15) - 1)}
        />
      </Box>
    </Box>
  );
};
