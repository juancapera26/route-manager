import { useRef } from "react";

export const useMapInitializer = () => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const initMap = (elementId: string, center: google.maps.LatLngLiteral) => {
    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(
        document.getElementById(elementId) as HTMLElement,
        { center, zoom: 15, disableDefaultUI: true }
      );
    }
    return { map: mapRef.current };
  };

  return { mapRef, initMap };
};
