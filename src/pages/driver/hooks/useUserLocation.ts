import { useState } from "react";

export const useUserLocation = () => {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocalización no soportada");
      setCenter({ lat: 4.711, lng: -74.0721 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(coords);
      },
      (err) => {
        console.error("Error obteniendo ubicación:", err.message);
        setCenter({ lat: 4.711, lng: -74.0721 });
      },
      { enableHighAccuracy: true }
    );
  };

  return { center, getUserLocation };
};
