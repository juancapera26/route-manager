import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { Paquete } from "../../../../hooks/useManifiestos";

interface ListaPaquetesProps {
  paquetes: Paquete[];
  mostrarLetras: boolean;
  letras: string;
  onIniciarRuta: () => void; // ✅ callback único
}

const ListaPaquetes: React.FC<ListaPaquetesProps> = ({
  paquetes,
  mostrarLetras,
  letras,
  onIniciarRuta,
}) => (
  <Paper
    elevation={4}
    sx={{
      width: "100%",
      p: 2,
      display: "flex",
      flexDirection: "column",
      borderRadius: 2,
    }}
  >
    {/* Encabezado */}
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" fontWeight="bold">
        Zona
      </Typography>
      <Typography variant="subtitle2" sx={{ color: "gray" }}>
        #15967
      </Typography>
    </Box>

    {/* Lista paquetes */}
    <Box
      sx={{
        flex: 1,
        maxHeight: "50vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        pr: 1,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255,255,255,0.3)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(255,255,255,0.5)",
        },
      }}
    >
      {paquetes.map((p, i) => (
        <Paper
          key={p.codigo_rastreo}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1.5,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <span>📦</span>
            <Box>
              <Typography fontWeight="600" fontSize="0.9rem">
                Código: {p.codigo_rastreo}
              </Typography>
              <Typography variant="caption" sx={{ color: "gray" }}>
                {p.direccion}
              </Typography>
            </Box>
          </Box>

          {mostrarLetras && (
            <Typography fontWeight="bold" color="primary">
              {letras[i]}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>

    {/* Botón inferior */}
    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        onClick={onIniciarRuta} // 🚀 pasa a InicioRuta
        sx={{ bgcolor: "#2563eb" }}
      >
        Empezar
      </Button>
    </Box>
  </Paper>
);

export default ListaPaquetes;
