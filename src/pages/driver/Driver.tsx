// ✅ Versión mejorada del componente Driver con actualización de posición real
import { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useUserLocation } from "./hooks/useUserLocation";
import { LocateButton } from "./components/LocateButton";
import { StreetViewButton } from "./components/StreetViewButton";
import { ZoomControls } from "./components/ZoomControls";
import { Box, Button } from "@mui/material";
import { Paquete } from "../../hooks/useManifiestos";
import FormDelivery from "./modals/FormDelivery";
import { DeliveryFormData } from "../../global/types/deliveries";

interface DriverProps {
  paquetes?: Paquete[];
}

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export const Driver: React.FC<DriverProps> = () => {
  const { location, getUserLocation } = useUserLocation();
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const [carIcon, setCarIcon] = useState<google.maps.Icon | null>(null);
  const [paqueteIcon, setPaqueteIcon] = useState<google.maps.Icon | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [selectedPaquete, setSelectedPaquete] = useState<Paquete | null>(null);

  const [sortedPaquetes, setSortedPaquetes] = useState<Paquete[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPath, setSimulationPath] = useState<google.maps.LatLng[]>(
    []
  );
  const [currentLocation, setCurrentLocation] =
    useState<google.maps.LatLngLiteral | null>(null); // 🔹 nueva ubicación actual

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  // Crear íconos personalizados
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

      setCurrentLocation(location); // 🔹 Guardar ubicación inicial
    } else {
      mapRef.current.panTo(location);
      userMarkerRef.current?.setPosition(location);
      setCurrentLocation(location);
    }
  }, [isLoaded, location, carIcon]);

  // Obtener y dibujar la ruta
  const fetchRoute = async (
    origin: google.maps.LatLngLiteral,
    destination: Paquete
  ) => {
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
                  latitude: destination.lat!,
                  longitude: destination.lng!,
                },
              },
            },
            travelMode: "DRIVE",
          }),
        }
      );

      const data = await res.json();
      const encoded = data.routes?.[0]?.polyline?.encodedPolyline;
      if (!encoded || !mapRef.current) return;

      const path = google.maps.geometry.encoding.decodePath(encoded);

      if (polylineRef.current) polylineRef.current.setMap(null);

      polylineRef.current = new google.maps.Polyline({
        path,
        strokeColor: "#1976d2",
        strokeOpacity: 0.85,
        strokeWeight: 6,
      });

      polylineRef.current.setMap(mapRef.current);
      setSimulationPath(path);

      const bounds = new google.maps.LatLngBounds();
      path.forEach((latLng) => bounds.extend(latLng));
      mapRef.current.fitBounds(bounds);
    } catch (err) {
      console.error("Error Routes API:", err);
    }
  };

  // 🚗 Simular movimiento del vehículo
  const startSimulation = () => {
    if (!simulationPath.length || !userMarkerRef.current) return;
    setIsSimulating(true);

    let i = 0;
    const interval = setInterval(() => {
      if (i >= simulationPath.length) {
        clearInterval(interval);
        setIsSimulating(false);

        // 🔹 Al llegar, actualizar ubicación actual
        const lastPos = simulationPath[simulationPath.length - 1];
        const nuevaUbicacion = { lat: lastPos.lat(), lng: lastPos.lng() };
        setCurrentLocation(nuevaUbicacion);

        console.log("✅ Llegó al destino. Nueva ubicación:", nuevaUbicacion);
        handleNextDestination(nuevaUbicacion); // calcular siguiente desde aquí
        return;
      }

      const pos = simulationPath[i];
      userMarkerRef.current!.setPosition(pos);
      mapRef.current?.panTo(pos);

      i++;
    }, 300);
  };

  // 📦 Cargar paquetes desde localStorage
  useEffect(() => {
    const handler = () => {
      const storedPaquetes = localStorage.getItem("paquetesRuta");
      if (!storedPaquetes || !location || !paqueteIcon) return;

      let paquetes: Paquete[] = [];
      try {
        paquetes = JSON.parse(storedPaquetes);
      } catch {
        return;
      }

      const validos = paquetes.filter((p) => p.lat && p.lng);
      if (!validos.length) return;

      const ordenados = validos
        .map((p) => ({
          ...p,
          distance: google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(location.lat, location.lng),
            new google.maps.LatLng(p.lat!, p.lng!)
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      setSortedPaquetes(ordenados);
      setCurrentIndex(0);

      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = ordenados.map((p) => {
        const marker = new google.maps.Marker({
          position: { lat: p.lat!, lng: p.lng! },
          map: mapRef.current!,
          icon: paqueteIcon,
          title: p.direccion || "Paquete",
        });
        marker.addListener("click", () => {
          setSelectedPaquete(p);
          setOpenForm(true);
        });
        return marker;
      });

      fetchRoute(location, ordenados[0]);
    };

    window.addEventListener("paquetesRutaUpdated", handler);
    return () => window.removeEventListener("paquetesRutaUpdated", handler);
  }, [location, paqueteIcon]);

  // 🔹 Avanzar al siguiente destino desde ubicación actual
  const handleNextDestination = (nuevoOrigen?: google.maps.LatLngLiteral) => {
    const origenActual = nuevoOrigen || currentLocation || location!;
    if (!sortedPaquetes.length) return;

    const paquetesRestantes = sortedPaquetes.slice(currentIndex + 1);
    if (!paquetesRestantes.length) {
      alert("🎉 Todas las entregas completadas.");
      if (polylineRef.current) polylineRef.current.setMap(null);
      return;
    }

    const siguiente = paquetesRestantes.reduce((masCercano, actual) => {
      const distMasCercano =
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(origenActual.lat, origenActual.lng),
          new google.maps.LatLng(masCercano.lat!, masCercano.lng!)
        );
      const distActual = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(origenActual.lat, origenActual.lng),
        new google.maps.LatLng(actual.lat!, actual.lng!)
      );
      return distActual < distMasCercano ? actual : masCercano;
    });

    setCurrentIndex(sortedPaquetes.findIndex((p) => p === siguiente));
    fetchRoute(origenActual, siguiente);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (!isLoaded) return <div>Cargando mapa...</div>;

  const toDeliveryFormData = (p: Paquete): DeliveryFormData => ({
    orderId: p.codigo_rastreo || "",
    reference: p.tipo_paquete || "",
    content: `${p.largo}x${p.ancho}x${p.alto} cm (${p.peso} kg)`,
    value: p.valor_declarado ?? null,
    clientName: "",
    address: p.direccion || "",
    phone: "",
    deliveryNotes: "",
  });

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

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNextDestination()}
        >
          Siguiente destino
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={startSimulation}
          disabled={isSimulating}
        >
          Simular ruta
        </Button>
      </Box>

      <FormDelivery
        open={openForm}
        onClose={() => setOpenForm(false)}
        initial={
          selectedPaquete ? toDeliveryFormData(selectedPaquete) : undefined
        }
      />
    </Box>
  );
};
