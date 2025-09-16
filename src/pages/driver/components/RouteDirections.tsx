import { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

interface RouteDirectionsProps {
  origin: google.maps.LatLngLiteral | null;
  destination: string | null;
}

export const RouteDirections: React.FC<RouteDirectionsProps> = ({
  origin,
  destination,
}) => {
  const [steps, setSteps] = useState<google.maps.DirectionsStep[]>([]);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    if (!origin || !destination) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const route = result.routes[0];
          const leg = route.legs[0];

          setSteps(leg.steps);
          setDistance(leg.distance?.text || null);
          setDuration(leg.duration?.text || null);
        } else {
          console.error("Error obteniendo ruta:", status);
        }
      }
    );
  }, [origin, destination]);

  if (!origin || !destination) {
    return <Typography>Seleccione un destino para ver la ruta</Typography>;
  }

  return (
    <Box
      sx={{
        p: 2,
        maxHeight: "89vh",
        overflowY: "auto",
        borderLeft: "1px solid #ddd",
        backgroundColor: "white",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Indicaciones de la ruta
      </Typography>

      {distance && duration && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Distancia: {distance} – Tiempo estimado: {duration}
        </Typography>
      )}

      <List>
        {steps.map((step, idx) => (
          <ListItem key={idx} sx={{ alignItems: "flex-start" }}>
            <ListItemText
              primary={
                <span dangerouslySetInnerHTML={{ __html: step.instructions }} />
              }
              secondary={`${step.distance?.text || ""} – ${
                step.duration?.text || ""
              }`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
