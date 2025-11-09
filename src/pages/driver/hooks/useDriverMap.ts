import { useEffect, useRef, useState } from "react";
import { createCarIcon } from "../utils/mapIcons";

export const useDriverMap = (location?: google.maps.LatLngLiteral) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const [carIcon, setCarIcon] = useState<google.maps.Icon | null>(null);

  useEffect(() => {
    if (!location) return;

    const mapElement = document.getElementById("map") as HTMLElement;
    if (!mapElement) return;

    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(mapElement, {
        center: location,
        zoom: 15,
        disableDefaultUI: true,
      });
    } else {
      mapRef.current.panTo(location);
    }

    if (!carIcon) {
      setCarIcon(createCarIcon());
      return;
    }

    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.Marker({
        position: location,
        map: mapRef.current,
        icon: carIcon,
      });
    } else {
      userMarkerRef.current.setPosition(location);
    }
  }, [location, carIcon]);

  return { mapRef, userMarkerRef, carIcon };
};
