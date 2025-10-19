import { useEffect, useRef, useState } from "react";
import { Paquete } from "../../../hooks/useManifiestos";
import { DeliveryFormData } from "../../../global/types/deliveries";
import { createPaqueteIcon } from "../utils/mapIcons";
import { ordenarPaquetesPorDistancia } from "../utils/paquetesUtils";

export const useRouteManager = (
  mapRef: React.MutableRefObject<google.maps.Map | null>,
  location?: google.maps.LatLngLiteral | null
) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [selectedPaquete, setSelectedPaquete] = useState<Paquete | null>(null);
  const [sortedPaquetes, setSortedPaquetes] = useState<Paquete[]>([]);
  const [paqueteIcon, setPaqueteIcon] = useState<google.maps.Icon | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.LatLng[]>([]);
  const [currentDestino, setCurrentDestino] = useState<Paquete | null>(null);

  //  Calcular distancia 
  const calcularDistancia = (
    a: google.maps.LatLngLiteral,
    b: google.maps.LatLngLiteral
  ) => {
    const R = 6371e3;
    const φ1 = (a.lat * Math.PI) / 180;
    const φ2 = (b.lat * Math.PI) / 180;
    const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
    const Δλ = ((b.lng - a.lng) * Math.PI) / 180;

    const x =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  };


  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      setPaqueteIcon(createPaqueteIcon());
    }
  }, []);

  // Manejar actualización de paquetes
  useEffect(() => {
    const handler = async () => {
      if (!location || !mapRef.current || !paqueteIcon) return;

      const stored = localStorage.getItem("paquetesRuta");
      if (!stored) {
        clearRoute();
        setSortedPaquetes([]);
        setCurrentDestino(null);
        return;
      }

      const paquetes = ordenarPaquetesPorDistancia(
        JSON.parse(stored),
        location
      );
      setSortedPaquetes(paquetes);

      markersRef.current.forEach((m) => m.setMap(null));

      markersRef.current = paquetes.map((p) => {
        const marker = new google.maps.Marker({
          position: { lat: p.lat!, lng: p.lng! },
          map: mapRef.current!,
          icon: paqueteIcon!,
          title: p.direccion || "Paquete",
        });
        marker.addListener("click", () => {
          setSelectedPaquete(p);
          setOpenForm(true);
        });
        return marker;
      });
    };

    window.addEventListener("paquetesRutaUpdated", handler);
    return () => window.removeEventListener("paquetesRutaUpdated", handler);
  }, [location, paqueteIcon]);

  // Limpiar ruta
  const clearRoute = () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    setRoutePath([]);

    if (location && mapRef.current) {
      mapRef.current.setCenter(location);
      mapRef.current.setZoom(14);
    }
  };

  //Dibujar ruta
  const drawRoute = async (
    origin: google.maps.LatLngLiteral,
    destination: Paquete
  ): Promise<google.maps.LatLng[]> => {
    if (!mapRef.current) return [];

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY!;
      const requestBody = {
        origin: {
          location: { latLng: { latitude: origin.lat, longitude: origin.lng } },
        },
        destination: {
          location: {
            latLng: { latitude: destination.lat!, longitude: destination.lng! },
          },
        },
        travelMode: "DRIVE",
      };

      const res = await fetch(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) return [];

      const data = await res.json();
      const encoded = data.routes?.[0]?.polyline?.encodedPolyline;
      if (!encoded) return [];

      const path = google.maps.geometry.encoding.decodePath(encoded);
      setRoutePath(path);

      if (polylineRef.current) polylineRef.current.setMap(null);
      polylineRef.current = new google.maps.Polyline({
        path,
        strokeColor: "#1976d2",
        strokeOpacity: 0.9,
        strokeWeight: 6,
        map: mapRef.current,
      });

      const bounds = new google.maps.LatLngBounds();
      path.forEach((latLng) => bounds.extend(latLng));
      mapRef.current.fitBounds(bounds);

      return path;
    } catch (err) {
      console.error(" Error mostrando ruta:", err);
      return [];
    }
  };

  // 🔄 Recalcular ruta
  useEffect(() => {
    if (!location || !sortedPaquetes.length) return;

    let masCercano: Paquete | null = null;
    let menorDistancia = Infinity;

    for (const p of sortedPaquetes) {
      if (!p.lat || !p.lng) continue;
      const distancia = calcularDistancia(location, { lat: p.lat, lng: p.lng });
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        masCercano = p;
      }
    }

    if (masCercano && masCercano !== currentDestino) {
      setCurrentDestino(masCercano);
      drawRoute(location, masCercano);
    }
  }, [location?.lat, location?.lng, sortedPaquetes]);

  const handleNextDestination = async (
    currentLocation?: google.maps.LatLngLiteral
  ): Promise<google.maps.LatLng[] | null> => {
    if (!currentDestino || !sortedPaquetes.length || !currentLocation)
      return null;

    const nuevos = sortedPaquetes.filter((p) => p !== currentDestino);
    setSortedPaquetes(nuevos);

    if (!nuevos.length) {
      setCurrentDestino(null);
      clearRoute();
      return null;
    }

    let masCercano: Paquete | null = null;
    let menorDistancia = Infinity;

    for (const p of nuevos) {
      const distancia = calcularDistancia(currentLocation, {
        lat: p.lat!,
        lng: p.lng!,
      });
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        masCercano = p;
      }
    }

    if (!masCercano) return null;

    setCurrentDestino(masCercano);
    const newPath = await drawRoute(currentLocation, masCercano);
    return newPath.length ? newPath : null;
  };

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

  return {
    handleNextDestination,
    openForm,
    selectedPaquete,
    setOpenForm,
    toDeliveryFormData,
    sortedPaquetes,
    clearRoute,
    routePath,
    drawRoute,
    currentDestino,
    setSelectedPaquete,
  };
};
