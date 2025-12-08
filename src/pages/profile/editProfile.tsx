import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";
import { updateAdmin } from '../../global/services/adminProfileService';

interface EditProfileProps {
  onVolver?: () => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ onVolver }) => {
  const {
    nombre,
    apellido,
    correo,
    documento,
    telefono,
    idUsuario,
    getAccessToken,
  } = useAuth();

  const [formData, setFormData] = useState<{ 
    telefono_movil: string;
    correo: string;
  }>({
    telefono_movil: telefono || "",
    correo: correo || "",
  });

  // Guardamos los valores originales para comparar
  const telefonoOriginal = telefono || "";
  const correoOriginal = correo || "";

  const [loading, setLoading] = useState(false);

  // Sincronizar el formData cuando los datos del useAuth cambien
  useEffect(() => {
    setFormData({
      telefono_movil: telefono || "",
      correo: correo || "",
    });
  }, [telefono, correo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Si el campo es telefono, actualizamos telefono_movil
    if (name === "telefono") {
      setFormData({ ...formData, telefono_movil: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGuardar = async () => {
    if (!idUsuario) {
      toast.error("ID del administrador inválido");
      return;
    }

    // Debug: Ver valores actuales
    console.log("🔍 formData.telefono_movil:", formData.telefono_movil);
    console.log("🔍 telefono original:", telefono);
    console.log("🔍 formData.correo:", formData.correo);
    console.log("🔍 correoOriginal:", correoOriginal);

    // Determinar qué campos cambiaron
    const telefonoCambio = formData.telefono_movil !== telefonoOriginal;
    const correoCambio = formData.correo !== correoOriginal;

    console.log("🔍 telefonoCambio:", telefonoCambio);
    console.log("🔍 correoCambio:", correoCambio);

    // Si no hay cambios, no hacer nada
    if (!telefonoCambio && !correoCambio) {
      toast.info("No hay cambios para guardar");
      return;
    }

    // Solo enviar los campos que cambiaron
    const payload: { telefono_movil?: string; correo?: string } = {};
    
    // Validar y agregar teléfono solo si cambió
    if (telefonoCambio) {
      if (!formData.telefono_movil || !formData.telefono_movil.trim()) {
        toast.error("El teléfono no puede estar vacío");
        return;
      }

      if (!/^\d+$/.test(formData.telefono_movil)) {
        toast.error("El teléfono solo debe contener números");
        return;
      }

      if (formData.telefono_movil.length !== 10) {
        toast.error("El teléfono debe tener 10 dígitos");
        return;
      }

      payload.telefono_movil = formData.telefono_movil;
    }
    
    // Validar y agregar correo solo si cambió
    if (correoCambio) {
      if (!formData.correo || !formData.correo.trim()) {
        toast.error("El correo electrónico no puede estar vacío");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.correo)) {
        toast.error("El correo electrónico no es válido");
        return;
      }

      payload.correo = formData.correo;
    }

    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        toast.error("Token no disponible");
        setLoading(false);
        return;
      }

      // Actualizamos el backend en el endpoint correcto
      const updatedUser = await updateAdmin(idUsuario, payload, token);

      console.log("✅ Respuesta del servidor:", updatedUser);

      // Actualizamos el estado local con la info nueva
      setFormData({
        telefono_movil: updatedUser.telefono_movil || formData.telefono_movil,
        correo: updatedUser.correo || formData.correo,
      });

      const camposActualizados = Object.keys(payload).map(key => 
        key === 'telefono_movil' ? 'teléfono' : 'correo'
      ).join(' y ');

      toast.success(`${camposActualizados.charAt(0).toUpperCase() + camposActualizados.slice(1)} actualizado correctamente`);
      
      // Recargar la página para obtener los datos actualizados
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("❌ Error completo:", err);
      
      // Manejo específico de errores
      if (err instanceof Error) {
        const errorMessage = err.message;
        
        if (errorMessage.includes("uq_correo") || errorMessage.includes("Unique constraint")) {
          toast.error("Este correo electrónico ya está en uso por otro usuario");
        } else if (errorMessage.includes("Firebase")) {
          toast.error("Error al sincronizar con Firebase. Intenta de nuevo.");
        } else if (errorMessage.includes("telefono")) {
          toast.error("Error con el número de teléfono");
        } else {
          toast.error("Error al actualizar. Intenta de nuevo.");
        }
        
        console.error("❌ Mensaje:", errorMessage);
      } else {
        toast.error("Error al actualizar administrador");
      }
    } finally {
      setLoading(false);
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

        {/* Campos editables */}
        <TextField
          label="Correo electrónico"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono_movil}
          onChange={handleChange}
          fullWidth
        />
      </Box>

      <Box mt={4} display="flex" justifyContent="space-between">
        {onVolver && (
          <Button variant="outlined" onClick={onVolver}>
            Regresar
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleGuardar}
          disabled={loading}
          sx={{ ml: "auto" }}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </Box>
    </Paper>
  );
};

export default EditProfile;