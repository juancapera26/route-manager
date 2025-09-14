export const useRoute = (
  map: google.maps.Map | null,
  renderer: google.maps.DirectionsRenderer | null
) => {
  const requestRoute = (
    origin: google.maps.LatLngLiteral,
    destination: string | google.maps.LatLngLiteral
  ) => {
    if (!map || !renderer) return;
    const directionsService = new google.maps.DirectionsService();

    const handleResult = (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus
    ) => {
      if (status === "OK" && result) {
        renderer.setDirections(result);
      } else {
        console.error("Error calculando ruta:", status);
      }
    };

    if (typeof destination === "string") {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: destination }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry) {
          const loc = results[0].geometry.location;
          handleResult(
            null,
            google.maps.DirectionsStatus.INVALID_REQUEST // inicial
          );
          directionsService.route(
            {
              origin,
              destination: { lat: loc.lat(), lng: loc.lng() },
              travelMode: google.maps.TravelMode.DRIVING,
            },
            handleResult
          );
        }
      });
    } else {
      directionsService.route(
        { origin, destination, travelMode: google.maps.TravelMode.DRIVING },
        handleResult
      );
    }
  };

  return { requestRoute };
};
