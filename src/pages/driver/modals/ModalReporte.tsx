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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  imagen?: string | null; // ahora usamos lo que devuelve el backend
  fecha: string;
  estado: "pendiente" | "enviado" | "rechazado";
  tipo: "Logística" | "Operativa";
}

interface ModalReporteProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalReporte: React.FC<ModalReporteProps> = ({ isOpen, onClose }) => {
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [tipo, setTipo] = useState<"Logística" | "Operativa">("Logística");
  const [step, setStep] = useState<
    "form" | "confirm" | "success" | "historial"
  >("form");
  const [error, setError] = useState("");
  const [reportes, setReportes] = useState<Reporte[]>([]);

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

  // Confirmar y enviar reporte al backend
  const handleConfirmarEnvio = async () => {
    try {
      const formData = new FormData();
      formData.append("descripcion", descripcion);
      formData.append("tipo", tipo);
      if (archivo) {
        formData.append("archivo", archivo); // 👈 backend espera "archivo"
      }

      const response = await fetch("http://localhost:3000/reportes/subir", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al enviar reporte");

      const data = await response.json();

      const nuevoReporte: Reporte = {
        descripcion: data.descripcion || descripcion,
        imagen: data.imagen || null, // 👈 ahora usamos la URL que responde NestJS
        fecha: data.fecha || new Date().toLocaleDateString(),
        estado: data.estado || "enviado",
        tipo: data.tipo || tipo,
      };

      setReportes((prev) => [...prev, nuevoReporte]);

      // Resetear formulario
      setDescripcion("");
      setArchivo(null);
      setTipo("Logística");
      setStep("success");
    } catch (err) {
      console.error(err);
      setError("Hubo un error al enviar el reporte");
    }
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

            <FormControl fullWidth>
              <InputLabel id="tipo-label">Tipo de novedad</InputLabel>
              <Select
                labelId="tipo-label"
                value={tipo}
                onChange={(e) =>
                  setTipo(e.target.value as "Logística" | "Operativa")
                }
              >
                <MenuItem value="Logística">Logística</MenuItem>
                <MenuItem value="Operativa">Operativa</MenuItem>
              </Select>
            </FormControl>

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
                    <TableCell>Tipo</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Evidencia</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportes.map((r, index) => (
                    <TableRow key={index}>
                      <TableCell>{r.fecha}</TableCell>
                      <TableCell>{r.tipo}</TableCell>
                      <TableCell>{r.descripcion}</TableCell>
                      <TableCell>
                        {r.imagen ? (
                          <img
                            src={`http://localhost:3000/${r.imagen}`}
                            alt="Evidencia"
                            width={80}
                          />
                        ) : (
                          "NO CONTIENE"
                        )}
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
