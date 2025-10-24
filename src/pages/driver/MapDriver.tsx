import { Box, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useUserLocation } from "./hooks/useUserLocation";
import { LocateButton } from "./components/LocateButton";
import { StreetViewButton } from "./components/StreetViewButton";
import { ZoomControls } from "./components/ZoomControls";
import FormDelivery from "./modals/FormDelivery";
import { useDriverMap } from "./hooks/useDriverMap";
import { useDriverSimulation } from "./hooks/useDriverSimulation";
import { useRouteManager } from "./hooks/useRouteManager";

interface MapDriverProps {
  rutaId: number; 
}

export const MapDriver = ({ rutaId }: MapDriverProps) => {
  const { location, getUserLocation, isLoaded, updateLocation } =
    useUserLocation();
  const { mapRef, userMarkerRef } = useDriverMap(location || undefined);
  const { isSimulating, startSimulation, stopSimulation } = useDriverSimulation(
    mapRef,
    userMarkerRef,
    updateLocation
  );

  const {
    handleNextDestination,
    openForm,
    selectedPaquete,
    setOpenForm,
    toDeliveryFormData,
    routePath,
    currentDestino,
    setSelectedPaquete,
  } = useRouteManager(mapRef, location, rutaId); // 🔹 Pasar rutaId

  const hasStartedRef = useRef(false);
  const [autoMode, setAutoMode] = useState(false);

  // Centrar mapa en la ubicación del conductor
  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.setCenter(location);
    }
  }, [location, mapRef]);

  // Iniciar simulación de la ruta
  const handleStartSimulation = () => {
    if (!routePath.length || isSimulating) return;
    hasStartedRef.current = true;
    setAutoMode(true);

    startSimulation(routePath, async () => {
      stopSimulation();

      if (currentDestino) {
        setSelectedPaquete(currentDestino);
        setOpenForm(true);
      }
    });
  };

  // Manejar el envío del formulario de entrega
  const handleSubmitSuccess = async () => {
    setOpenForm(false);

    const { newPath, nextDestino } = await handleNextDestination(location!);

    if (!newPath || !nextDestino) {
      stopSimulation();
      console.log("Todas las entregas completadas 🚚✅");
      return;
    }

    setSelectedPaquete(nextDestino);

    await startSimulation(newPath, async () => {
      setOpenForm(true);
    });
  };

  if (!isLoaded || !location) {
    return <div>Cargando mapa y ubicación del conductor...</div>;
  }

  return (
    <Box sx={{ position: "relative", width: "100%", height: "89vh" }}>
      <Box id="map" sx={{ width: "100%", height: "100%" }} />

      {/* Controles */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <LocateButton
          googleMap={mapRef.current}
          getUserLocation={getUserLocation}
          userMarkerRef={userMarkerRef}
          location={location}
        />
        <StreetViewButton location={location} mapRef={mapRef} />
        <ZoomControls
          onZoomIn={() =>
            mapRef.current?.setZoom((mapRef.current?.getZoom() || 15) + 1)
          }
          onZoomOut={() =>
            mapRef.current?.setZoom((mapRef.current?.getZoom() || 15) - 1)
          }
        />

        {!autoMode && (
          <Button
            variant="outlined"
            color="secondary"
            disabled={isSimulating || !routePath.length}
            onClick={handleStartSimulation}
          >
            Simular ruta
          </Button>
        )}
      </Box>

      {/* Modal de entrega */}
      <FormDelivery
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmitSuccess={handleSubmitSuccess}
        initial={
          selectedPaquete ? toDeliveryFormData(selectedPaquete) : undefined
        }
      />
    </Box>
  );
};
