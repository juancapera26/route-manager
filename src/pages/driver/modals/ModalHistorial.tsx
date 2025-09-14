import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalHistorialProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

// Datos simulados de manifiestos
const manifiestos = [
  { codigo: "#15967", fecha: "25/02/2025", hora: "6:30 am / 6:30 pm" },
  { codigo: "#15968", fecha: "26/02/2025", hora: "7:00 am / 5:30 pm" },
  { codigo: "#15969", fecha: "27/02/2025", hora: "8:00 am / 4:00 pm" },
];

const ModalHistorial: React.FC<ModalHistorialProps> = ({
  isOpen,
  onClose,
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  const [filters, setFilters] = useState({ dia: "", mes: "", anio: "" });

  if (!isOpen) return null;

  const leftPos = isExpanded || isHovered || isMobileOpen ? 290 : 90;

  // 👉 Filtrar manifiestos en base a día, mes y año
  const filtered = manifiestos.filter((m) => {
    const [d, mth, y] = m.fecha.split("/"); // descomponer la fecha
    return (
      (filters.dia === "" || filters.dia === d) &&
      (filters.mes === "" || filters.mes === mth) &&
      (filters.anio === "" || filters.anio === y)
    );
  });

  const noResults = filtered.length === 0;

  return (
    <Paper
      elevation={6}
      sx={{
        position: "fixed",
        top: 64,
        left: leftPos,
        zIndex: 60,
        width: 420,
        height: "calc(100vh - 64px)",
        borderRadius: 3,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight="600">
          Historial de rutas
        </Typography>
        <IconButton color="error" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* 🔎 Filtros */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
        <Typography variant="body1" fontWeight="500">
          Filtrar por fecha
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            label="Día"
            value={filters.dia}
            onChange={(e) => setFilters({ ...filters, dia: e.target.value })}
            sx={{ width: 70 }}
          />
          <TextField
            size="small"
            label="Mes"
            value={filters.mes}
            onChange={(e) => setFilters({ ...filters, mes: e.target.value })}
            sx={{ width: 70 }}
          />
          <TextField
            size="small"
            label="Año"
            value={filters.anio}
            onChange={(e) => setFilters({ ...filters, anio: e.target.value })}
            sx={{ width: 90 }}
          />
        </Box>
      </Box>

      {/* Tabla o mensaje de error */}
      <Box sx={{ flex: 1, overflowX: "auto", px: 2, pb: 2 }}>
        {noResults ? (
          <Typography
            variant="body2"
            color="error"
            align="center"
            sx={{ mt: 2, fontWeight: "600" }}
          >
            Fecha de ruta no encontrada
          </Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Manifiesto</TableCell>
                <TableCell>Hora inicio / fin</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((m, i) => (
                <TableRow
                  key={i}
                  hover
                  sx={{ "&:hover": { bgcolor: "action.hover", cursor: "pointer" } }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight="500"
                      sx={{ cursor: "pointer" }}
                    >
                      {m.codigo}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{m.hora}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{m.fecha}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Paper>
  );
};

export default ModalHistorial;
