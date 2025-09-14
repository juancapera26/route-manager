import React from "react";
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
  const theme = useTheme(); // 👈 detectamos si está en modo oscuro o claro

  return (
    <Paper
      elevation={6}
      sx={{
        display: "flex",
        gap: 4,
        p: 4,
        borderRadius: 3,
        bgcolor: theme.palette.mode === "dark" ? "#1e2a38" : "#f9fbff", // 👈 cambia según modo
        color: theme.palette.text.primary,
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
            border: `3px solid ${theme.palette.primary.main}`, // 👈 borde azul
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

        <Button
          variant="outlined"
          size="small"
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
            mb: 3,
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
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 2 }}>
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
        <Box sx={{ mt: 4 }}>
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
