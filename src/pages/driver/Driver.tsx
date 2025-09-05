import { useEffect, useState, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Box, IconButton } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { createRoot } from "react-dom/client";

const libraries: "marker"[] = ["marker"];
const containerStyle = { width: "100%", height: "100vh" };
const MAP_ID = "TU_MAP_ID_AQUI"; // opcional

export const  Driver = () => {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Función para obtener la ubicación y centrar el mapa
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocalización no soportada");
      setCenter({ lat: 4.711, lng: -74.0721 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(coords);

        // Mover el mapa suavemente
        if (mapRef.current) {
          mapRef.current.panTo(coords);
          mapRef.current.setZoom(18); // zoom cercano
        }

        if (markerRef.current) {
          markerRef.current.position = coords;
        }
      },
      (error) => {
        console.error(
          "Error obteniendo ubicación: ",
          error.code,
          error.message
        );
        setCenter({ lat: 4.711, lng: -74.0721 });
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (!isLoaded || !center) return;

    if (!mapRef.current) {
      // Crear mapa
      mapRef.current = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center,
          zoom: 15,
          disableDefaultUI: true,
          streetViewControl: true,
          minZoom: 3,
          maxZoom: 20,
          mapId: MAP_ID || undefined,
        }
      );

      // Crear contenido del marcador usando MUI
      const content = document.createElement("div");
      const root = createRoot(content);
      root.render(
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

      // Crear marcador avanzado
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position: center,
        map: mapRef.current,
        title: "Mi ubicación",
        content,
      });

      // Crear botón junto a la “personita” de Street View (BOTTOM_LEFT)
      const buttonDiv = document.createElement("div");
      buttonDiv.style.marginLeft = "10px"; // separarlo un poco del borde
      buttonDiv.style.marginBottom = "10px";

      const buttonRoot = createRoot(buttonDiv);
      buttonRoot.render(
        <IconButton
          color="primary"
          onClick={getUserLocation}
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

      mapRef.current.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        buttonDiv
      );
    } else if (markerRef.current) {
      markerRef.current.position = center;
      mapRef.current.panTo(center); // mantener centrado si cambia
    }
  }, [isLoaded, center]);

  return <div id="map" style={containerStyle}></div>;
};
