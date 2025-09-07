import React from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";

interface FormularioProps {
  codigo: string;
  setCodigo: (c: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  mensajeError: string;
  loading: boolean;
}

const Formulario: React.FC<FormularioProps> = ({
  codigo,
  setCodigo,
  handleSubmit,
  mensajeError,
  loading,
}) => (
  <Paper
    elevation={6}
    sx={{
      p: 3,
      width: "100%",
      textAlign: "center",
    }}
  >
    <Typography variant="h6" gutterBottom fontWeight="bold">
      Ingrese el código de manifiesto
    </Typography>
    <Typography variant="body2" color="text.secondary" gutterBottom>
      Para empezar a realizar la jornada
    </Typography>

    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
    >
      <TextField
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        label="Código de manifiesto"
        variant="outlined"
        error={!!mensajeError}
        helperText={mensajeError}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ py: 1.2, fontWeight: "bold" }}
      >
        {loading ? "Cargando..." : "Ingresar"}
      </Button>
    </Box>
  </Paper>
);

export default Formulario;
