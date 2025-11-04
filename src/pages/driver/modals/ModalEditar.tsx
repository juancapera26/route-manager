import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { toast } from "sonner";
import useAuth from "../../../hooks/useAuth";
import { useUpdateDriver } from "../../../components/admin/drivers/hooks/useUpdateDriver";

interface ModalEditarProps {
  onVolver: () => void;
}

const ModalEditar: React.FC<ModalEditarProps> = ({ onVolver }) => {
  const {
    nombre,
    apellido,
    correo,
    documento,
    telefono,
    idUsuario,
    getAccessToken,
  } = useAuth();
  const { updateDriver, loading, error } = useUpdateDriver();

  const [formData, setFormData] = useState<{ telefono: string }>({
    telefono: telefono || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (!idUsuario) {
      toast.error("ID del conductor inválido");
      return;
    }

    // Validaciones
    if (!formData.telefono) {
      toast.error("El teléfono no puede estar vacío");
      return;
    }

    if (!/^\d+$/.test(formData.telefono)) {
      toast.error("El teléfono solo debe contener números");
      return;
    }

    if (formData.telefono.length !== 10) {
      toast.error("El teléfono debe tener 10 dígitos");
      return;
    }

    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Token no disponible");
        return;
      }

      const payload = { telefono: formData.telefono };

      // Actualizamos el backend en el endpoint correcto
      const updatedUser = await updateDriver(idUsuario, payload, token);

      // Actualizamos el estado local con la info nueva
      setFormData({
        telefono: updatedUser.telefono || formData.telefono,
      });

      toast.success("Conductor actualizado correctamente");
    } catch (err) {
      console.error("Error al actualizar:", err);
      toast.error("Error al actualizar conductor");
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{ p: 4, borderRadius: 3, maxWidth: 1200, margin: "0 auto" }}
    >
      <Typography variant="h5" fontWeight="600" mb={2}>
        Ajuste
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Gestión de datos de tu cuenta
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        {/* Campos informativos */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Nombre
          </Typography>
          <Typography variant="body1">
            {nombre} {apellido}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Documento
          </Typography>
          <Typography variant="body1">{documento}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Correo electrónico
          </Typography>
          <Typography variant="body1">{correo}</Typography>
        </Box>

        {/* Campo editable: teléfono */}
        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          fullWidth
        />
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={onVolver}>
          Regresar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGuardar}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default ModalEditar;
