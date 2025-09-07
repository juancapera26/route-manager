import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// ✅ Importamos lista externa
import PALABRAS_PROHIBIDAS from "../../data/palabrasProhibidas.json";

interface ModalReporteProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalReporte: React.FC<ModalReporteProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [error, setError] = useState("");

  // Validar y pasar a confirmación
  const handleEnviar = () => {
    // 🔍 Recorremos lista y verificamos si alguna palabra está en la descripción
    const contieneProhibidas = PALABRAS_PROHIBIDAS.some((p) =>
      descripcion.toLowerCase().includes(p.toLowerCase())
    );

    if (contieneProhibidas) {
      setError("El reporte contiene palabras no permitidas.");
      return;
    }

    setError("");
    setStep("confirm");
  };

  // Confirmar y enviar reporte
  const handleConfirmarEnvio = () => {
    const nuevoReporte = {
      descripcion,
      archivo,
      fecha: new Date().toISOString(),
      estado: "enviado" as const,
    };

    console.log("Reporte generado:", nuevoReporte);
    setStep("success");
  };

  return (
    <>
      {/* Backdrop oscuro */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.5)",
          zIndex: 50,
        }}
        onClick={onClose} // clic afuera cierra modal
      />

      {/* Ventana modal */}
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 60,
          width: 500,
          borderRadius: 3,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="600">
            Reporte de incidentes
          </Typography>
          <IconButton color="error" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Paso 1: Formulario */}
        {step === "form" && (
          <>
            <Typography variant="body2" color="text.secondary">
              Por favor, llena este formulario para generar un reporte.
            </Typography>

            <TextField
              label="Describe el incidente"
              multiline
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              fullWidth
            />

            <Button variant="outlined" component="label">
              Adjuntar evidencia
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setArchivo(e.target.files ? e.target.files[0] : null)
                }
              />
            </Button>
            {archivo && (
              <Typography variant="caption" color="text.secondary">
                Archivo: {archivo.name}
              </Typography>
            )}

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleEnviar}
              sx={{ mt: 2 }}
            >
              Enviar
            </Button>
          </>
        )}

        {/* Paso 2: Confirmación */}
        {step === "confirm" && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              ¿Estás seguro de enviar el informe?
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={() => setStep("form")}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmarEnvio}
              >
                Enviar
              </Button>
            </Box>
          </Box>
        )}

        {/* Paso 3: Éxito */}
        {step === "success" && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography variant="h6" color="success.main" fontWeight="600">
              ¡Tu reporte ha sido enviado correctamente!
            </Typography>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default ModalReporte;
