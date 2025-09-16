import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useUserLocation } from "./hooks/useUserLocation";
import { LocateButton } from "./components/LocateButton";
import { StreetViewButton } from "./components/StreetViewButton";
import { ZoomControls } from "./components/ZoomControls";
import { Box } from "@mui/material";
import { Paquete } from "../../hooks/useManifiestos";

interface DriverProps {
  paquetes?: Paquete[];
}

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export const Driver: React.FC<DriverProps> = () => {
  const { location, getUserLocation } = useUserLocation();
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const [carIcon, setCarIcon] = useState<google.maps.Icon | null>(null);
  const [paqueteIcon, setPaqueteIcon] = useState<google.maps.Icon | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]); // 👈 guardar marcadores de paquetes

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  // Crear íconos
  useEffect(() => {
    if (!isLoaded) return;

    setCarIcon({
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="#1976d2" stroke="white" stroke-width="2"/>
            <path d="M12 23h1.5v1.5a1.5 1.5 0 003 0V23h3v1.5a1.5 1.5 0 003 0V23H24a1 1 0 001-1v-4l-1.5-4.5a1.5 1.5 0 00-1.5-1.2h-9a1.5 1.5 0 00-1.5 1.2L10 18v4a1 1 0 001 1zm1-6l1-3h8l1 3h-10z" fill="white"/>
          </svg>
        `),
      scaledSize: new google.maps.Size(36, 36),
      anchor: new google.maps.Point(18, 18),
    });

    setPaqueteIcon({
      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
      scaledSize: new google.maps.Size(36, 36),
    });
  }, [isLoaded]);

  // Inicializar mapa
  useEffect(() => {
    if (!isLoaded || !location || !carIcon) return;

    if (!mapRef.current) {
      const mapElement = document.getElementById("map") as HTMLElement;
      if (!mapElement) return;

      mapRef.current = new google.maps.Map(mapElement, {
        center: location,
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: false,
      });

      userMarkerRef.current = new google.maps.Marker({
        position: location,
        map: mapRef.current,
        icon: carIcon,
      });
    } else {
      mapRef.current.panTo(location);
      userMarkerRef.current?.setPosition(location);
    }
  }, [isLoaded, location, carIcon]);

  // Construir ruta con Routes API v2
  const fetchRoute = async (
    origin: google.maps.LatLngLiteral,
    paquetes: Paquete[]
  ) => {
    if (!paquetes.length) return;

    const destination = paquetes[paquetes.length - 1];
    const waypoints = paquetes.slice(0, -1).map((p) => ({
      location: { latLng: { latitude: p.lat, longitude: p.lng } },
    }));

    try {
      const res = await fetch(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
            "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
          },
          body: JSON.stringify({
            origin: {
              location: {
                latLng: { latitude: origin.lat, longitude: origin.lng },
              },
            },
            destination: {
              location: {
                latLng: {
                  latitude: destination.lat,
                  longitude: destination.lng,
                },
              },
            },
            travelMode: "DRIVE",
            intermediates: waypoints,
          }),
        }
      );

      const data = await res.json();
      const encoded = data.routes?.[0]?.polyline?.encodedPolyline;
      if (!encoded || !mapRef.current) return;

      const path = google.maps.geometry.encoding.decodePath(encoded);

      // 🔹 limpiar polyline anterior antes de dibujar
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      polylineRef.current = new google.maps.Polyline({
        path,
        strokeColor: "#1976d2",
        strokeOpacity: 0.85,
        strokeWeight: 6,
      });

      // 🔹 añadir al mapa
      polylineRef.current.setMap(mapRef.current);

      // 🔹 ajustar el mapa a la nueva ruta
      const bounds = new google.maps.LatLngBounds();
      path.forEach((latLng) => bounds.extend(latLng));
      mapRef.current.fitBounds(bounds);
    } catch (err) {
      console.error("Error Routes API:", err);
    }
  };

  // Escuchar evento "paquetesRutaUpdated"
  useEffect(() => {
    const handler = () => {
      const storedPaquetes = localStorage.getItem("paquetesRuta");

      // 👉 Si no hay paquetes => limpiar ruta + marcadores
      if (!storedPaquetes) {
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        return;
      }

      if (!location || !paqueteIcon) return;

      let paquetes: Paquete[] = [];
      try {
        paquetes = JSON.parse(storedPaquetes);
      } catch {
        return;
      }

      // 🔹 filtrar solo los que tengan lat/lng válidos
      const paquetesValidos = paquetes
        .filter((p) => p.lat !== undefined && p.lng !== undefined)
        .map((p) => ({
          ...p,
          lat: Number(p.lat),
          lng: Number(p.lng),
        }));

      // 🔹 Debug: ver qué datos válidos quedan
      console.log(
        "📍 Paquetes válidos para ruta:",
        paquetesValidos.map((p) => [p.lat, p.lng])
      );

      // limpiar ruta previa
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }

      // limpiar marcadores previos
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      if (!paquetesValidos.length) return;

      // dibujar nueva ruta
      fetchRoute(location, paquetesValidos);

      // pintar nuevos marcadores
      markersRef.current = paquetesValidos.map(
        (p) =>
          new google.maps.Marker({
            position: { lat: p.lat, lng: p.lng },
            map: mapRef.current!,
            icon: paqueteIcon,
            title: p.direccion || "Paquete",
          })
      );
    };

    window.addEventListener("paquetesRutaUpdated", handler);
    return () => window.removeEventListener("paquetesRutaUpdated", handler);
  }, [location, paqueteIcon]);

  useEffect(() => {
    getUserLocation();
  }, []);

  if (!isLoaded) return <div>Cargando mapa...</div>;

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
          userMarkerRef={userMarkerRef}
          location={location}
        />
        <StreetViewButton
          onClick={() => {
            if (!mapRef.current || !location) return;
            const panorama = new google.maps.StreetViewPanorama(
              document.getElementById("map") as HTMLElement,
              { position: location, pov: { heading: 34, pitch: 10 }, zoom: 1 }
            );
            mapRef.current.setStreetView(panorama);
          }}
        />
        <ZoomControls
          onZoomIn={() =>
            mapRef.current?.setZoom((mapRef.current?.getZoom() || 15) + 1)
          }
          onZoomOut={() =>
            mapRef.current?.setZoom((mapRef.current?.getZoom() || 15) - 1)
          }
        />
      </Box>
    </Box>
  );
};
