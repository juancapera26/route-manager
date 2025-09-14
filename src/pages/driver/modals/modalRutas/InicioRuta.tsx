import React from "react";
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
  paqueteActual?: Paquete;
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  mostrarLetras: boolean;
  letras: string;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const InicioRuta: React.FC<InicioRutaProps> = ({
  paqueteActual,
  currentIndex,
  setCurrentIndex,
  mostrarLetras,
  letras,
  onNextStep,
  onPrevStep,
}) => {
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
          #15967
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Camioneta placa: ASD234
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          {currentIndex + 1}/30
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
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>

          {/* Info paquete */}
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight="600" fontSize="0.9rem">
              📦 Código paquete {paqueteActual.codigo_rastreo}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Dirección {paqueteActual.direccion}
            </Typography>
          </Box>

          {/* Letra */}
          <Typography fontWeight="bold" color="primary">
            {mostrarLetras ? letras[currentIndex] : ""}
          </Typography>

          {/* Flecha derecha */}
          <IconButton
            size="small"
            onClick={() => setCurrentIndex(currentIndex + 1)}
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
