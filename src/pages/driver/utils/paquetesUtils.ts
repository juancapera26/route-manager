import { Paquete } from "../../../hooks/useManifiestos";

export const ordenarPaquetesPorDistancia = (
  paquetes: Paquete[],
  origen: google.maps.LatLngLiteral
): Paquete[] => {
  const validos = paquetes.filter((p) => p.lat && p.lng);
  return validos
    .map((p) => ({
      ...p,
      distance: google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(origen.lat, origen.lng),
        new google.maps.LatLng(p.lat!, p.lng!)
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
};
