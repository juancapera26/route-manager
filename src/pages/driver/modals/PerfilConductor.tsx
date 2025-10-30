import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  useTheme,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import {
  updateFotoPerfil,
  ConductorUpdated,
} from "../../../global/services/driverService";

interface PerfilConductorProps {
  nombre: string;
  apellido: string;
  celular: string;
  correo: string;
  documento: string;
  empresa: string | number;
  rol: string | number;
  enLinea: boolean;
  foto: string | null;
  onEditar: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const PerfilConductor: React.FC<PerfilConductorProps> = ({
  nombre,
  apellido,
  celular,
  correo,
  documento,
  empresa,
  rol,
  enLinea,
  foto,
  onEditar,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getAccessToken, idUsuario } = useAuth();

  const [previewFoto, setPreviewFoto] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // 🔄 Normalizamos la URL que viene desde backend
  useEffect(() => {
    if (foto) {
      setPreviewFoto(foto.startsWith("http") ? foto : `${API_URL}/${foto}`);
    }
  }, [foto]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!idUsuario) return;
    const token = await getAccessToken();
    if (!token) return;

    setLoading(true);
    try {
      const updated: ConductorUpdated = await updateFotoPerfil(
        idUsuario,
        file,
        token
      );

      if (updated.foto_perfil) {
        setPreviewFoto(
          updated.foto_perfil.startsWith("http")
            ? updated.foto_perfil
            : `${API_URL}/${updated.foto_perfil}`
        );
      }

      console.log("✅ Foto de perfil actualizada");
    } catch (err) {
      console.error("❌ Error al actualizar foto:", err);
    } finally {
      setLoading(false);
    }
  };

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
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={previewFoto}
            sx={{
              width: 120,
              height: 120,
              border: `3px solid ${theme.palette.primary.main}`,
            }}
          />
          <input
            accept="image/*"
            id="upload-avatar"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor="upload-avatar">
            <IconButton
              component="span"
              disabled={loading}
              sx={{
                position: "absolute",
                bottom: -10,
                right: -10,
                border: `1px solid ${theme.palette.primary.main}`,
                color: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: "white",
                  color: theme.palette.primary.dark,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <PhotoCamera fontSize="small" />
              )}
            </IconButton>
          </label>
        </Box>

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

        {/* 🔹 Sección de Disponibilidad */}
        <Box
          sx={{
            textAlign: "center",
            mt: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="600">
            Disponibilidad
          </Typography>
          <Typography variant="body1" color="success.main" fontWeight="bold">
            Disponible
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Horario: 6am - 3pm
          </Typography>
        </Box>

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

      <Divider orientation="vertical" flexItem />

      {/* Columna derecha */}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 6 }}>
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
            onClick={onEditar}
            sx={{
              bgcolor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
          >
            Editar Perfil
          </Button>
        </Box>

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
