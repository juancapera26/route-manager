import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Paquete } from "../../../../hooks/useManifiestos";

interface VistaMinimizadaProps {
  codigo: string;
  paquetes: Paquete[];
  onNext: () => void;
}

const VistaMinimizada: React.FC<VistaMinimizadaProps> = ({
  codigo,
  paquetes,
  onNext,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 1.5,
      borderRadius: 2,
      boxShadow: 2,
    }}
  >
    {paquetes.length > 0 ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/* Zona e índice */}
        <Typography fontWeight="700">
          Zona #{codigo} &nbsp; 1/{paquetes.length}
        </Typography>

        {/* Código paquete */}
        <Typography>
          <strong> Código paquete</strong> {paquetes[0].codigo_rastreo}
        </Typography>

        {/* Dirección */}
        <Typography>
          <strong>Dirección</strong> {paquetes[0].direccion}
        </Typography>

        {/* Letra */}
        <Typography fontWeight="bold" color="primary">
          A
        </Typography>
      </Box>
    ) : (
      <Typography>No hay paquetes</Typography>
    )}

    {/* Botón para expandir */}
    <IconButton size="small" color="primary" onClick={onNext}>
      <KeyboardArrowDownIcon />
    </IconButton>
  </Box>
);

export default VistaMinimizada;
