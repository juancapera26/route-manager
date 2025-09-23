// PerfilConductor.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  useTheme,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router";
import ModalEditar from "./ModalEditar"; // 👉 importa tu vista de edición

interface PerfilConductorProps {
  nombre: string;
  apellido: string;
  celular: string;
  correo: string;
  documento: string;
  empresa: string;
  rol: string;
  enLinea: boolean;
  fotoUrl?: string;
}

const PerfilConductor: React.FC<PerfilConductorProps> = ({
  nombre,
  apellido,
  celular,
  correo,
  documento,
  empresa,
  rol,
  enLinea,
  fotoUrl,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [editando, setEditando] = useState(false); // 👉 controla qué vista mostrar

  // Si está en modo edición, mostramos la vista ModalEditar
  if (editando) {
    return <ModalEditar onVolver={() => setEditando(false)} />;
  }

  return (
    <Paper
      elevation={6}
      sx={{
        display: "flex",
        gap: 4,
        p: 4,
        borderRadius: 3,
        bgcolor: theme.palette.mode === "dark" ? "#1e2a38" : "#f9fbff",
        color: theme.palette.text.primary,
        minHeight: "500px",
      }}
    >
      {/* Columna izquierda */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 220,
          gap: 2,
        }}
      >
        <Avatar
          src={fotoUrl}
          sx={{
            width: 120,
            height: 120,
            border: `3px solid ${theme.palette.primary.main}`,
          }}
        />
        <Typography
          variant="subtitle1"
          fontWeight="600"
          color={theme.palette.primary.main}
        >
          {rol}
        </Typography>
        <Chip
          label={enLinea ? "En línea" : "Desconectado"}
          color={enLinea ? "success" : "default"}
        />

        {/* Disponibilidad */}
        <Box textAlign="center" mt={2}>
          <Typography variant="body2" color="text.secondary">
            Disponibilidad
          </Typography>
          <Typography variant="body2" color="success.main" fontWeight="600">
            Disponible
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Horario: 6am - 3pm
          </Typography>
        </Box>

        {/* Botón Volver */}
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(-1)}
          sx={{
            mt: 2,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            "&:hover": {
              borderColor: theme.palette.primary.dark,
              color: theme.palette.primary.dark,
            },
          }}
        >
          Volver
        </Button>
      </Box>

      {/* Línea divisoria */}
      <Divider orientation="vertical" flexItem />

      {/* Columna derecha */}
      <Box sx={{ flex: 1 }}>
        {/* Header con botón editar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 6,
          }}
        >
          <Typography
            variant="h6"
            fontWeight="600"
            color={theme.palette.primary.main}
          >
            Datos personales
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => setEditando(true)} // 👉 activa modo edición
            sx={{
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Editar Perfil
          </Button>
        </Box>

        {/* Datos personales organizados */}
        <Box
          sx={{ display: "grid", gridTemplateColumns: "2fr 3fr", rowGap: 8 }}
        >
          <Typography>
            <b>Nombre Apellido:</b> {nombre} {apellido}
          </Typography>
          <Typography>
            <b>Correo electrónico:</b> {correo}
          </Typography>
          <Typography>
            <b>Celular:</b> {celular}
          </Typography>
          <Typography>
            <b>Documento:</b> {documento}
          </Typography>
        </Box>

        {/* Empresa */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="subtitle1"
            fontWeight="600"
            color={theme.palette.primary.main}
          >
            {empresa}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default PerfilConductor;
