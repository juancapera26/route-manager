import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// 🚫 Lista de palabras prohibidas directamente en el código
const PALABRAS_PROHIBIDAS: string[] = [
  "groseria1",
  "groseria2",
  "maldicion",
  "insulto",
];

interface Reporte {
  descripcion: string;
  archivo?: File | null;
  fecha: string;
  estado: "pendiente" | "enviado" | "rechazado";
}

interface ModalReporteProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalReporte: React.FC<ModalReporteProps> = ({ isOpen, onClose }) => {
  // 👇 Hooks SIEMPRE primero
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [step, setStep] = useState<
    "form" | "confirm" | "success" | "historial"
  >("form");
  const [error, setError] = useState("");
  const [reportes, setReportes] = useState<Reporte[]>([]);

  // 👇 Validación después de los hooks
  if (!isOpen) return null;

  // Validar y pasar a confirmación
  const handleEnviar = () => {
    const contieneProhibidas = PALABRAS_PROHIBIDAS.some((p: string) =>
      descripcion.toLowerCase().includes(p.toLowerCase())
    );

    if (contieneProhibidas) {
      setError("El reporte contiene palabras no permitidas.");
      return;
    }

    setError("");
    setStep("confirm");
  };

  // Confirmar y guardar reporte
  const handleConfirmarEnvio = () => {
    const nuevoReporte: Reporte = {
      descripcion,
      archivo,
      fecha: new Date().toLocaleDateString(),
      estado: "enviado",
    };

    setReportes((prev) => [...prev, nuevoReporte]);

    setDescripcion("");
    setArchivo(null);
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
        onClick={onClose}
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

            <Button
              variant="text"
              sx={{ mt: 0.5 }}
              onClick={() => setStep("historial")}
            >
              Ver mis reportes
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
            <Button
              variant="text"
              sx={{ mt: 2 }}
              onClick={() => setStep("historial")}
            >
              Ver mis reportes
            </Button>
          </Box>
        )}

        {/* Paso 4: Historial */}
        {step === "historial" && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Mis reportes
            </Typography>

            {reportes.length === 0 ? (
              <Typography color="text.secondary">
                No tienes reportes...
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Evidencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportes.map((r, index) => (
                    <TableRow key={index}>
                      <TableCell>{r.fecha}</TableCell>
                      <TableCell>{r.descripcion}</TableCell>
                      <TableCell>
                        {r.archivo ? r.archivo.name : "NO CONTIENE"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => setStep("form")}
            >
              Hacer nuevo reporte
            </Button>
          </Box>
        )}
      </Paper>
    </>
  );
};

export default ModalReporte;
