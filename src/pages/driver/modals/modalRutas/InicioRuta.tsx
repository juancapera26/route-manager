import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import {
  ArrowBackIosNew as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { Paquete } from "../../../../hooks/useManifiestos";

interface InicioRutaProps {
  mostrarLetras: boolean;
  letras: string;
  onNextStep: () => void;
  onPrevStep: () => void;
  codigoManifiesto: string;
  vehiculo: string;
}

const InicioRuta: React.FC<InicioRutaProps> = ({
  mostrarLetras,
  letras,
  onNextStep,
  onPrevStep,
  codigoManifiesto,
  vehiculo,
}) => {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [paqueteActual, setPaqueteActual] = useState<Paquete | null>(null);

  // Cargar los paquetes ordenados desde localStorage
  useEffect(() => {
    const storedPaquetes = localStorage.getItem("paquetesRuta");
    if (storedPaquetes) {
      const paquetesParsed: Paquete[] = JSON.parse(storedPaquetes);
      setPaquetes(paquetesParsed);
      setPaqueteActual(paquetesParsed[0] || null); // Establecer el primer paquete como el actual
    }
  }, []); // Solo cargar una vez al montar el componente

  // Guardar paquetes en localStorage cada vez que se actualiza el paquete
  useEffect(() => {
    if (paquetes.length > 0) {
      localStorage.setItem("paquetesRuta", JSON.stringify(paquetes));
    }
  }, [paquetes]);

  // Función para avanzar al siguiente paquete
  const avanzarAlSiguiente = () => {
    if (paqueteActual) {
      const indexActual = paquetes.indexOf(paqueteActual);
      if (indexActual < paquetes.length - 1) {
        setPaqueteActual(paquetes[indexActual + 1]); // Avanzar al siguiente paquete
      }
    }
  };

  // Función para retroceder al paquete anterior
  const retrocederAlAnterior = () => {
    if (paqueteActual) {
      const indexActual = paquetes.indexOf(paqueteActual);
      if (indexActual > 0) {
        setPaqueteActual(paquetes[indexActual - 1]); // Retroceder al paquete anterior
      }
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        bgcolor: "background.paper",
      }}
    >
      {/* Encabezado */}
      <Box>
        <Typography variant="subtitle2" fontWeight="bold">
          Zona
        </Typography>
        <Typography variant="body1" fontWeight="700">
          Código manifiesto: {codigoManifiesto}{" "}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {vehiculo}{" "}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {paquetes.length > 0
            ? `${paquetes.indexOf(paqueteActual as Paquete) + 1}/${
                paquetes.length
              }` // Asegurándonos que no sea null
            : "0/0"}
        </Typography>
      </Box>

      <Divider />

      {/* Paquete actual */}
      {paqueteActual ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Flecha izquierda */}
          <IconButton
            size="small"
            disabled={paquetes.indexOf(paqueteActual) === 0}
            onClick={retrocederAlAnterior}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>

          {/* Info paquete */}
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight="600" fontSize="0.9rem">
              Código paquete {paqueteActual.codigo_rastreo}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dirección {paqueteActual.direccion}
            </Typography>
          </Box>

          {/* Letra */}
          <Typography fontWeight="bold" color="primary">
            {mostrarLetras
              ? letras[paquetes.indexOf(paqueteActual as Paquete)]
              : ""}{" "}
            {/* Asegurándonos que no sea null */}
          </Typography>

          {/* Flecha derecha */}
          <IconButton
            size="small"
            disabled={paquetes.indexOf(paqueteActual) === paquetes.length - 1}
            onClick={avanzarAlSiguiente}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Typography color="text.secondary">No hay paquetes</Typography>
      )}

      <Divider />

      {/* Botones de acción */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ExpandMoreIcon />}
          onClick={onNextStep}
        >
          Mostrar todas
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<KeyboardArrowUpIcon />}
          onClick={onPrevStep}
        >
          Minimizar
        </Button>
      </Box>
    </Paper>
  );
};

export default InicioRuta;
