import { useRef } from "react";

export const useMapInitializer = () => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const initMap = (elementId: string, center: google.maps.LatLngLiteral) => {
    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(
        document.getElementById(elementId) as HTMLElement,
        { center, zoom: 15, disableDefaultUI: true }
      );
      directionsRendererRef.current = new google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(mapRef.current);
    }
    return { map: mapRef.current, renderer: directionsRendererRef.current };
  };

  return { mapRef, directionsRendererRef, initMap };
};
