import { useState, useRef } from "react";

interface LatLng {
  lat: number;
  lng: number;
}

export const useDriverSimulation = (
  mapRef: React.MutableRefObject<google.maps.Map | null>,
  userMarkerRef: React.MutableRefObject<google.maps.Marker | null>,
  updateLocation?: (pos: LatLng) => void
) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const stopFlag = useRef(false); // permite detener la simulación manualmente

  // Detener la simulación
  const stopSimulation = () => {
    stopFlag.current = true;
    setIsSimulating(false);
  };

  // Iniciar simulación
  const startSimulation = async (
    path: google.maps.LatLng[],
    onArrive?: () => Promise<void>
  ) => {
    if (!path.length || !userMarkerRef.current) return;
    setIsSimulating(true);
    stopFlag.current = false;

    const marker = userMarkerRef.current;
    const currentPos = marker.getPosition();

    let startIndex = 0;
    if (currentPos) {
      let minDist = Infinity;
      path.forEach((p, i) => {
        const d = google.maps.geometry.spherical.computeDistanceBetween(
          p,
          currentPos
        );
        if (d < minDist) {
          minDist = d;
          startIndex = i;
        }
      });
    }

    for (let i = startIndex; i < path.length; i++) {
      if (stopFlag.current) break;
      const position = path[i];
      await new Promise((r) => setTimeout(r, 100));
      marker.setPosition(position);
      mapRef.current?.panTo(position);
    }

    const lastPosition = path[path.length - 1];
    if (!stopFlag.current && lastPosition) {
      const newLocation = {
        lat: lastPosition.lat(),
        lng: lastPosition.lng(),
      };
      updateLocation?.(newLocation);
    }

    setIsSimulating(false);

    if (!stopFlag.current && onArrive) await onArrive();
  };

  return { isSimulating, startSimulation, stopSimulation };
};
