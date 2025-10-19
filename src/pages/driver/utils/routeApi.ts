export const decodePolyline = (encoded: string): google.maps.LatLng[] =>
  google.maps.geometry.encoding.decodePath(encoded);

export const fetchRoute = async (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
) => {
  const res = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
        "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
      },
      body: JSON.stringify({
        origin: { location: { latLng: origin } },
        destination: { location: { latLng: destination } },
        travelMode: "DRIVE",
      }),
    }
  );

  const data = await res.json();
  const encoded = data.routes?.[0]?.polyline?.encodedPolyline;
  return encoded ? decodePolyline(encoded) : [];
};
