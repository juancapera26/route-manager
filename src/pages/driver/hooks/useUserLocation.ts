import { useState } from "react";

export const useUserLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  ); // Almacenamos la ubicación
  const [locationAvailable, setLocationAvailable] = useState<boolean>(false);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocalización no soportada");
      setLocationAvailable(false); // Indicamos que no se pudo obtener la ubicación
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords); // Guardamos las coordenadas en el estado
        setLocationAvailable(true); // Marcamos que la ubicación está disponible
      },
      (err) => {
        console.error("Error obteniendo ubicación:", err.message);
        setLocationAvailable(false); // Indicamos que no se pudo obtener la ubicación
      },
      { enableHighAccuracy: true }
    );
  };

  return { location, locationAvailable, getUserLocation }; // Devolvemos location
};
