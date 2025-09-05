import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos";

interface ModalRutasProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

interface Direccion {
  codigo: string;
  direccion: string;
  lat: number;
  lng: number;
}

const MANIFIESTO_CORRECTO = "#15967";
const PAQUETES_INICIALES: Direccion[] = [
  { codigo: "45673456789", direccion: "carrera123 #13-4", lat: 4.625, lng: -74.07 },
  { codigo: "45673456780", direccion: "calle 100 #50-10", lat: 4.67, lng: -74.096 },
  { codigo: "45673456781", direccion: "avenida 68 #89-45", lat: 4.664, lng: -74.112 },
  { codigo: "45673456782", direccion: "calle 80 #60-30", lat: 4.676, lng: -74.103 },
  { codigo: "45673456783", direccion: "cra 7 #26-45", lat: 4.609, lng: -74.083 },
  { codigo: "45673456784", direccion: "cra 10 #80-40", lat: 4.69, lng: -74.04 },
  { codigo: "45673456785", direccion: "calle 63 #15-21", lat: 4.638, lng: -74.078 },
];

const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const ModalRutas: React.FC<ModalRutasProps> = ({
  isOpen,
  onClose,
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  // Estados
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [mostrarPaquetes, setMostrarPaquetes] = useState(false);
  const [mostrarLetras, setMostrarLetras] = useState(false);
  const [paquetes, setPaquetes] = useState<Direccion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"expanded" | "collapsed" | "minimized">("expanded");

  const centroBogota = { lat: 4.711, lng: -74.0721 };

  // Funciones
  const ordenarDireccionesPorDistancia = () => {
    const ordenados = [...paquetes].sort((a, b) => {
      const distA = haversineDistance(centroBogota.lat, centroBogota.lng, a.lat, a.lng);
      const distB = haversineDistance(centroBogota.lat, centroBogota.lng, b.lat, b.lng);
      return distA - distB;
    });
    setPaquetes(ordenados);
    setMostrarLetras(true);
    setCurrentIndex(0);
    setViewMode("collapsed");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.trim() === MANIFIESTO_CORRECTO) {
      setError("");
      setPaquetes(PAQUETES_INICIALES);
      setMostrarPaquetes(true);
      setMostrarLetras(false);
      setCurrentIndex(0);
      setViewMode("expanded");
    } else {
      setError("CÓDIGO NO ENCONTRADO");
      setMostrarPaquetes(false);
      setMostrarLetras(false);
      setPaquetes([]);
      setCurrentIndex(0);
    }
  };

  // Ayudas para render
  const direccionActual = paquetes.length > 0 ? paquetes[currentIndex] : null;
  const puedeRetroceder = currentIndex > 0;
  const puedeAvanzar = currentIndex < paquetes.length - 1;

  if (!isOpen) return null;

  const leftPos = isExpanded || isHovered || isMobileOpen ? 290 : 90;

  // Subcomponentes internos para organizar render
  const Formulario = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        label="Código de manifiesto"
        variant="outlined"
        error={!!error}
        helperText={error}
        fullWidth
        size="small"
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ alignSelf: "center", px: 4, bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
      >
        Ingresar
      </Button>
    </Box>
  );

  const VistaMinimizada = () => (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        p: 1,
        borderRadius: 1,
        bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[100],
      })}
    >
      {paquetes.length > 0 ? (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="body2" fontWeight="700" color="text.primary">
            ZONA {MANIFIESTO_CORRECTO}
          </Typography>
          <Typography variant="body2" color="text.primary">
            Código paquete: {paquetes[0].codigo}
          </Typography>
          <Typography variant="body2" color="text.primary">
            Dirección: {paquetes[0].direccion}
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary" sx={{ ml: 1 }}>
            A
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2">No hay direcciones</Typography>
      )}
      <IconButton
        size="small"
        color="primary"
        onClick={() => setViewMode("collapsed")}
        aria-label="Expandir a tarjeta"
      >
        <KeyboardArrowDownIcon />
      </IconButton>
    </Box>
  );

  const VistaColapsada = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {direccionActual ? (
        <Paper
          elevation={2}
         sx={(theme) => ({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderRadius: 2,
          bgcolor: theme.palette.mode === "dark" 
            ? theme.palette.grey[800] 
            : theme.palette.grey[200],
          color: theme.palette.text.primary,
})}

        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton
              size="small"
              color="primary"
              disabled={!puedeRetroceder}
              onClick={() => setCurrentIndex((idx) => idx - 1)}
            >
              <ArrowBackIcon fontSize="inherit" />
            </IconButton>
            <span style={{ fontSize: "1.3rem" }}>📍</span>
            <Box>
              <Typography variant="body2" fontWeight="700" color="text.primary">
                Código: {direccionActual.codigo}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {direccionActual.direccion}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" fontWeight="bold" color="primary">
            {mostrarLetras ? letras[currentIndex] : "A"}
          </Typography>

          <IconButton
            size="small"
            color="primary"
            disabled={!puedeAvanzar}
            onClick={() => setCurrentIndex((idx) => idx + 1)}
          >
            <ArrowForwardIcon fontSize="inherit" />
          </IconButton>
        </Paper>
      ) : (
        <Typography color="text.secondary">No hay direcciones</Typography>
      )}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" startIcon={<ExpandMoreIcon />} onClick={() => setViewMode("expanded")}>
          Mostrar todas las direcciones
        </Button>
        <Button variant="contained" startIcon={<KeyboardArrowUpIcon />} color="primary" onClick={() => setViewMode("minimized")}>
          Minimizar
        </Button>
      </Box>
    </Box>
  );

  const VistaExpandida = () => (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: "55vh", overflowY: "auto", pr: 1, mb: 2 }}>
        {paquetes.map((p, i) => (
          <Paper
            key={i}
            elevation={2}
           sx={(theme) => ({
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            p: 2,
            borderRadius: 2,
            mb: 2,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
})}

          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <span style={{ fontSize: "1.2rem" }}>📍</span>
              <Box>
                <Typography variant="body2" fontWeight="600" color="text.primary">
                  Código: {p.codigo}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {p.direccion}
                </Typography>
              </Box>
            </Box>
            {mostrarLetras && (
              <Typography variant="h6" fontWeight="bold" color="primary">
                {letras[i]}
              </Typography>
            )}
          </Paper>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" sx={{ px: 4, bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }} onClick={ordenarDireccionesPorDistancia}>
          Empezar
        </Button>
      </Box>
    </Box>
  );

  return (
    <Paper
      elevation={8}
      sx={(theme) => ({
        position: "fixed",
        top: "4rem",
        left: leftPos,
        zIndex: 60,
        width: viewMode === "minimized" ? 420 : 400,
        height:
          viewMode === "expanded"
            ? "calc(100vh - 4rem)"
            : viewMode === "collapsed"
            ? "auto"
            : 80,
        p: viewMode === "minimized" ? 1 : 3,
        borderRadius: 3,
        transition: "all 0.25s ease",
        bgcolor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      })}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography
          variant="h6"
          fontWeight="700"
          color="text.primary"
          sx={{ fontSize: viewMode === "minimized" ? "0.9rem" : "1rem" }}
        >
          {!mostrarPaquetes
            ? "Ingrese el código de manifiesto para comenzar"
            : (viewMode === "minimized" || viewMode === "collapsed") && paquetes.length > 0
            ? `ZONA ${MANIFIESTO_CORRECTO} - Código: ${paquetes[0].codigo} - Dirección: ${paquetes[0].direccion}`
            : "Listado de paquetes"}
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{ color: "error.main", padding: viewMode === "minimized" ? 0.5 : undefined }}
        >
          <CloseIcon fontSize={viewMode === "minimized" ? "small" : "medium"} />
        </IconButton>
      </Box>

      {/* Render por vista */}
      {!mostrarPaquetes ? (
        <Formulario />
      ) : viewMode === "minimized" ? (
        <VistaMinimizada />
      ) : viewMode === "collapsed" ? (
        <VistaColapsada />
      ) : (
        <VistaExpandida />
      )}
    </Paper>
  );
};

export default ModalRutas;
