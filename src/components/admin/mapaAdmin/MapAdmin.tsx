import React, { useEffect, useRef, useState } from "react";
import { getUbicacionesByRuta } from "../../../global/services/ubicacionesService";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { X } from "lucide-react";
import { Ruta } from "../../../global/types/rutas";

// Props del componente
interface MapAdminProps {
  isOpen: boolean;
  onClose: () => void;
  conductor: { nombre?: string } | null;
  rutaSeleccionada?: Ruta;
}

// Ubicaciones del conductor
interface Ubicacion {
  lat: number;
  lng: number;
}

// Paquetes tipados
interface PaqueteMapa {
  id_paquete: number;
  codigo_rastreo: string;
  estado_paquete:
    | "Pendiente"
    | "Asignado"
    | "En_ruta"
    | "Entregado"
    | "Fallido";
  cantidad: number;
  direccion_entrega: string;
  lat?: string | number;
  lng?: string | number;
  cliente?: {
    id_cliente: number;
    nombre?: string;
    apellido?: string;
  };
}

// Cargar Google Maps
const loadGoogleMaps = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve();

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
};

export const MapAdmin: React.FC<MapAdminProps> = ({
  isOpen,
  onClose,
  conductor,
  rutaSeleccionada,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [destinos, setDestinos] = useState<google.maps.Marker[]>([]);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Inicializar mapa
  useEffect(() => {
    if (!isOpen || !rutaSeleccionada) return;

    const initMap = async () => {
      try {
        await loadGoogleMaps(apiKey);
        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 4.710989, lng: -74.07209 },
          zoom: 12,
        });
        setMap(mapInstance);
      } catch (err) {
        console.error("Error al cargar Google Maps:", err);
      }
    };

    initMap();

    return () => {
      setMap(null);
      setMarker(null);
      destinos.forEach((m) => m.setMap(null));
      setDestinos([]);
    };
  }, [isOpen, rutaSeleccionada, apiKey]);

  // Mostrar ubicación del conductor
  useEffect(() => {
    if (!map || !rutaSeleccionada) return;

    const cargarUbicaciones = async () => {
      const result = await getUbicacionesByRuta(rutaSeleccionada.id_ruta);
      if (!result.ok) return;

      const ubicaciones = (result.data as Ubicacion[]) || [];
      if (ubicaciones.length === 0) return;

      const ultima = ubicaciones[ubicaciones.length - 1];
      const position = { lat: Number(ultima.lat), lng: Number(ultima.lng) };

      if (!marker) {
        const newMarker = new google.maps.Marker({
          position,
          map,
          title: conductor?.nombre || "Conductor",
          icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });
        setMarker(newMarker);
      } else {
        marker.setPosition(position);
      }

      map.setCenter(position);
    };

    cargarUbicaciones();
    const interval = setInterval(cargarUbicaciones, 5000);
    return () => clearInterval(interval);
  }, [map, marker, rutaSeleccionada, conductor]);

  // Mostrar destinos de entrega
  // Mostrar destinos de entrega y actualizar automáticamente
  // Mostrar destinos de entrega y actualizar automáticamente
  useEffect(() => {
    if (!map || !rutaSeleccionada) return;

    const geocoder = new google.maps.Geocoder();

    const cargarDestinos = async () => {
      // Limpiar marcadores antiguos
      destinos.forEach((m) => m.setMap(null));
      setDestinos([]);

      const nuevosMarcadores: google.maps.Marker[] = [];

      const procesarPaquete = async (pkg: PaqueteMapa) => {
        const lat = pkg.lat ? Number(pkg.lat) : null;
        const lng = pkg.lng ? Number(pkg.lng) : null;

        let position: google.maps.LatLng | null = null;

        if (lat !== null && lng !== null) {
          position = new google.maps.LatLng(lat, lng);
        } else {
          const direccionCompleta = `${pkg.direccion_entrega}, Bogotá, Colombia`;
          await new Promise<void>((resolve) => {
            geocoder.geocode(
              { address: direccionCompleta },
              (results, status) => {
                if (status === "OK" && results && results[0]) {
                  position = results[0].geometry.location;
                } else {
                  console.warn(
                    "No se pudo geocodificar:",
                    direccionCompleta,
                    status
                  );
                }
                resolve();
              }
            );
          });
        }

        if (!position) return;

        const marker = new google.maps.Marker({
          map,
          position,
          title: `📦 ${pkg.cliente?.nombre ?? ""} ${
            pkg.cliente?.apellido ?? ""
          }`,
          icon:
            pkg.estado_paquete === "Entregado"
              ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
              : pkg.estado_paquete === "Asignado"
              ? "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
              : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        });

        const info = new google.maps.InfoWindow({
          content: `
          <div style="font-size:14px">
            <b>Cliente:</b> ${pkg.cliente?.nombre ?? ""} ${
            pkg.cliente?.apellido ?? ""
          }<br/>
            <b>Dirección:</b> ${pkg.direccion_entrega}<br/>
            <b>Estado:</b> ${pkg.estado_paquete}
          </div>
        `,
        });

        marker.addListener("click", () => info.open(map, marker));
        nuevosMarcadores.push(marker);
      };

      // Recargar paquetes actualizados
      const paquetes = rutaSeleccionada.paquete as PaqueteMapa[];
      for (const pkg of paquetes) {
        await procesarPaquete(pkg);
        await new Promise((r) => setTimeout(r, 100)); // evitar bloqueos por geocoding
      }

      setDestinos(nuevosMarcadores);

      // Ajustar bounds
      const bounds = new google.maps.LatLngBounds();
      if (marker) bounds.extend(marker.getPosition()!);
      nuevosMarcadores.forEach((m) => bounds.extend(m.getPosition()!));
      map.fitBounds(bounds);
    };

    // Cargar inicialmente
    cargarDestinos();

    // Repetir cada 5 segundos
    const interval = window.setInterval(cargarDestinos, 5000);

    return () => clearInterval(interval);
  }, [map, rutaSeleccionada, marker]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        🗺️ Ubicación del conductor y destinos
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div
          ref={mapRef}
          id="google-map-container"
          style={{
            width: "100%",
            height: "70vh",
            borderRadius: "12px",
            background: "#e0e0e0",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
