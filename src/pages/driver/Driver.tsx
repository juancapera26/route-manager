import { useEffect, useState, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { Box, IconButton } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { createRoot } from "react-dom/client";

const libraries: "marker"[] = ["marker"];
const containerStyle = { width: "100%", height: "100vh" };
const MAP_ID = "TU_MAP_ID_AQUI"; // opcional

export const Driver = () => {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const mapRef = useRef<google.maps.Map | null>(null);
  const streetViewRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Obtener ubicación y centrar mapa
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

        if (mapRef.current) {
          mapRef.current.panTo(coords);
          mapRef.current.setZoom(18);
        }

        if (markerRef.current) {
          markerRef.current.position = coords;
        }
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error.code, error.message);
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
          minZoom: 3,
          maxZoom: 20,
          mapId: MAP_ID || undefined,
        }
      );

      // Crear instancia estable de Street View y enlazarla al mapa
      streetViewRef.current = new google.maps.StreetViewPanorama(
        document.getElementById("map") as HTMLElement,
        {
          pov: { heading: 0, pitch: 0 },
          visible: false,
        }
      );
      mapRef.current.setStreetView(streetViewRef.current);

      // Crear contenido del marcador con MUI
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

      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position: center,
        map: mapRef.current,
        title: "Mi ubicación",
        content,
      });

      // --- Botón ubicación ---
      const buttonDiv = document.createElement("div");
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

      // --- Controles de Zoom ---
      const zoomDiv = document.createElement("div");
      zoomDiv.style.display = "flex";
      zoomDiv.style.flexDirection = "column";
      zoomDiv.style.alignItems = "center";
      zoomDiv.style.gap = "4px";

      const zoomRoot = createRoot(zoomDiv);
      zoomRoot.render(
        <>
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
            onClick={() => {
              const map = mapRef.current;
              if (map) {
                const zoom = map.getZoom();
                if (zoom !== undefined && zoom !== null) {
                  map.setZoom(zoom + 1);
                }
              }
            }}
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
            onClick={() => {
              const map = mapRef.current;
              if (map) {
                const zoom = map.getZoom();
                if (zoom !== undefined && zoom !== null) {
                  map.setZoom(zoom - 1);
                }
              }
            }}
          >
            -
          </IconButton>
        </>
      );
      mapRef.current.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        zoomDiv
      );

      // --- Botón Street View ---
      const svDiv = document.createElement("div");
      const svRoot = createRoot(svDiv);
      svRoot.render(
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
          onClick={() => {
  if (center && streetViewRef.current) {
    const svService = new google.maps.StreetViewService();
    svService.getPanorama(
      { location: center, radius: 50, source: google.maps.StreetViewSource.OUTDOOR }, // 👈 solo panoramas de calle
      (data, status) => {
        if (status === "OK" && data?.location?.latLng) {
          // Solo abrir si tiene navegación
          if (data.links && data.links.length > 0) {
            streetViewRef.current!.setPosition(data.location.latLng);
            streetViewRef.current!.setPov({ heading: 0, pitch: 0 });
            streetViewRef.current!.setZoom(1); // 👈 zoom se maneja aparte
            streetViewRef.current!.setVisible(true);
          } else {
            alert("No hay Street View navegable en este punto 🚫");
          }
        } else {
          alert("No panorama disponible cerca de esta ubicación ❌");
        }
      }
    );
  }
}}

        >
          <svg width={20} height={20} viewBox="0 0 24 24">
            <circle cx="12" cy="7" r="4" fill="#1976d2" />
            <rect x="9" y="12" width="6" height="8" rx="3" fill="#1976d2" />
          </svg>
        </IconButton>
      );
      mapRef.current.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        svDiv
      );
    } else if (markerRef.current) {
      markerRef.current.position = center;
      mapRef.current.panTo(center);
    }
  }, [isLoaded, center]);

  return <div id="map" style={containerStyle}></div>;
};
