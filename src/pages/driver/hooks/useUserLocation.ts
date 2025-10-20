import { useEffect, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import type { Library } from "@googlemaps/js-api-loader";

const LIBRARIES: Library[] = ["places", "geometry"];

export const useUserLocation = () => {
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [locationAvailable, setLocationAvailable] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: LIBRARIES,
  });

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocalización no soportada por el navegador");
      setLocationAvailable(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setLocation(coords);
        setLocationAvailable(true);
      },
      (err) => {
        console.error("Error obteniendo ubicación:", err.message);
        setLocationAvailable(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const updateLocation = (pos: google.maps.LatLngLiteral) => {
    setLocation(pos);
    setLocationAvailable(true);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

    return {
    location,
    locationAvailable,
    getUserLocation,
    updateLocation,
    isLoaded,
  };
};
