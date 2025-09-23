// ModalEditar.tsx
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";

interface ModalEditarProps {
  onVolver: () => void; // 👉 para regresar a PerfilConductor
}

const ModalEditar: React.FC<ModalEditarProps> = ({ onVolver }) => {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        borderRadius: 3,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <Typography variant="h5" fontWeight="600" mb={2}>
        Ajuste
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Gestión de datos de tu cuenta
      </Typography>

      <Box
        component="form"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
        }}
      >
        {/* Campos bloqueados */}
        <TextField
          label="Nombre"
          defaultValue="Esteban Pinto Rincón Contreras"
          disabled
        />
        <TextField
          label="Documento"
          defaultValue="1547862459"
          disabled
        />
        <TextField
          label="Celular"
          defaultValue="4485123347"
          disabled
        />

        {/* Campos editables */}
        <TextField
          label="Correo electrónico"
          defaultValue="pepemorenox@gmail.com"
        />
        <TextField
          label="Dirección"
          fullWidth
          sx={{ gridColumn: "span 2" }}
        />
        <TextField label="Ciudad" />
        <TextField label="País" />

        <TextField
          select
          label="Vehículo principal"
          defaultValue="Camioneta"
          fullWidth
        >
          <MenuItem value="Camioneta">Camioneta</MenuItem>
          <MenuItem value="Camión">Camión</MenuItem>
          <MenuItem value="Moto">Moto</MenuItem>
        </TextField>
      </Box>

      {/* Botones */}
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onVolver}>
          Regresar
        </Button>
        <Button variant="contained" color="primary">
          Guardar
        </Button>
      </Box>
    </Paper>
  );
};

export default ModalEditar;
