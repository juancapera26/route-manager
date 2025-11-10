import { useEffect, useRef, useState } from "react";
import {
  getAllRutas,
  cambiarEstadoRuta,
} from "../../../../global/services/routeService";
import { createUbicacion } from "../../../../global/services/ubicacionesService";
import { DeliveryFormData } from "../../../../global/types/deliveries";
import { Ruta } from "../../../../global/types/paquete.types";
import { RutaEstado } from "../../../../global/types/rutas";
import { Paquete } from "../../../../hooks/useManifiestos";
import { createPaqueteIcon } from "../../../../pages/driver/utils/mapIcons";
import { ordenarPaquetesPorDistancia } from "../../../../pages/driver/utils/paquetesUtils";

export const useRouteManagerAdmin = (
  mapRef: React.MutableRefObject<google.maps.Map | null>,
  location?: google.maps.LatLngLiteral | null,
  rutaId?: number
) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const [openForm, setOpenForm] = useState(false);
  const [selectedPaquete, setSelectedPaquete] = useState<Paquete | null>(null);
  const [sortedPaquetes, setSortedPaquetes] = useState<Paquete[]>([]);
  const [paqueteIcon, setPaqueteIcon] = useState<google.maps.Icon | null>(null);
  const [routePath, setRoutePath] = useState<google.maps.LatLng[]>([]);
  const [currentDestino, setCurrentDestino] = useState<Paquete | null>(null);
  const [activeRutaId, setActiveRutaId] = useState<number | undefined>(rutaId);

  // 📍 Buscar ruta activa y guardar ubicación inicial
  useEffect(() => {
    if (activeRutaId) return;

    const fetchRutaActiva = async () => {
      try {
        const rutas: Ruta[] = await getAllRutas();
        const rutaActiva = rutas.find(
          (r) => r.estado_ruta === RutaEstado.Asignada
        );
        if (rutaActiva) {
          setActiveRutaId(rutaActiva.id_ruta);
          if (location) {
            await createUbicacion({
              id_ruta: rutaActiva.id_ruta,
              lat: location.lat,
              lng: location.lng,
            });
            console.log("📍 Ubicación inicial registrada");
          }
        }
      } catch (error) {
        console.error("Error obteniendo ruta activa:", error);
      }
    };

    fetchRutaActiva();
  }, [activeRutaId, location]);

  // 🔹 Calcular distancia
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

  // 🧭 Cargar icono de paquete
  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      setPaqueteIcon(createPaqueteIcon());
    }
  }, []);

  // 📦 Manejar actualización de paquetes
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
      localStorage.setItem("paquetesRuta", JSON.stringify(paquetes));

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
      console.error("Error mostrando ruta:", err);
      return [];
    }
  };

  // 🚗 Recalcular ruta automáticamente
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

  // 🚚 Cada vez que entrega un paquete → guarda ubicación
  const handleNextDestination = async (
    currentLocation?: google.maps.LatLngLiteral
  ): Promise<{
    newPath: google.maps.LatLng[] | null;
    nextDestino: Paquete | null;
  }> => {
    if (!currentDestino || !sortedPaquetes.length || !currentLocation)
      return { newPath: null, nextDestino: null };

    // 📍 Guardar ubicación actual en backend
    if (activeRutaId && currentLocation) {
      await createUbicacion({
        id_ruta: activeRutaId,
        lat: currentLocation.lat,
        lng: currentLocation.lng,
      });
      console.log("📍 Ubicación registrada al entregar paquete");
    }

    const nuevos = sortedPaquetes.filter(
      (p) => p.id_paquete !== currentDestino.id_paquete
    );
    setSortedPaquetes(nuevos);
    localStorage.setItem("paquetesRuta", JSON.stringify(nuevos));

    if (!nuevos.length) {
      setCurrentDestino(null);
      clearRoute();
      if (activeRutaId) {
        await cambiarEstadoRuta(activeRutaId, {
          estado_ruta: RutaEstado.Completada,
        });
      }
      return { newPath: null, nextDestino: null };
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
    if (!masCercano) return { newPath: null, nextDestino: null };

    setCurrentDestino(masCercano);
    const newPath = await drawRoute(currentLocation, masCercano);
    return {
      newPath: newPath.length ? newPath : null,
      nextDestino: masCercano,
    };
  };

  const toDeliveryFormData = (p: Paquete): DeliveryFormData => ({
    orderId: p.codigo_rastreo || "",
    id_paquete: p.id_paquete,
    reference: p.tipo_paquete || "",
    content: `${p.largo}x${p.ancho}x${p.alto} cm (${p.peso} kg)`,
    value: p.valor_declarado ?? null,
    clientName: "",
    address: p.direccion || "",
    phone: "",
    deliveryNotes: "",
    deliveryStatus: "Entregado",
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
