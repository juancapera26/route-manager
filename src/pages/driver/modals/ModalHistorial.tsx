// src/components/.../ModalHistorial.tsx
import React, { useState, useEffect } from "react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getAllRutas } from "../../../global/services/routeService";
import { Ruta, RutaEstado } from "../../../global/types/rutas";
import useAuth from "../../../hooks/useAuth";

interface ModalHistorialProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

const ModalHistorial: React.FC<ModalHistorialProps> = ({
  isOpen,
  onClose,
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  const [filters, setFilters] = useState({ dia: "", mes: "", anio: "" });
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen || !user?.email) return;

    const fetchRutas = async () => {
      setLoading(true);
      try {
        const allRutas = await getAllRutas();

        const rutasUsuario = allRutas.filter(
          (r) =>
            r.estado_ruta === RutaEstado.Completada &&
            r.usuario?.correo === user.email
        );

        setRutas(rutasUsuario);
      } catch (error) {
        console.error("Error cargando rutas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRutas();
  }, [isOpen, user]);

  if (!isOpen) return null;

  const leftPos = isExpanded || isHovered || isMobileOpen ? 290 : 90;

  const filtered = rutas.filter((ruta) => {
    const fecha = new Date(ruta.fecha_inicio);
    return (
      (filters.dia === "" || filters.dia === fecha.getDate().toString()) &&
      (filters.mes === "" ||
        filters.mes === (fecha.getMonth() + 1).toString()) &&
      (filters.anio === "" || filters.anio === fecha.getFullYear().toString())
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
      {/* Header dinámico */}
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
        {selectedRuta ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton size="small" onClick={() => setSelectedRuta(null)}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight="600">
                Paquetes del manifiesto {selectedRuta.cod_manifiesto}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h6" fontWeight="600">
              Historial de rutas
            </Typography>
            <IconButton color="error" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Si hay ruta seleccionada, mostrar sus paquetes */}
      {selectedRuta ? (
        <Box sx={{ flex: 1, overflowX: "auto", p: 2 }}>
          {selectedRuta.paquete && selectedRuta.paquete.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedRuta.paquete.map((p, index) => (
                  <TableRow key={index}>
                    <TableCell>{p.codigo_rastreo ?? "Sin código"}</TableCell>
                    <TableCell>
                      {p.direccion_entrega
                        ? `${JSON.stringify(p.direccion_entrega)}`
                        : "Sin dirección"}
                    </TableCell>

                    <TableCell>{p.estado_paquete}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2 }}
              color="text.secondary"
            >
              No hay paquetes registrados en esta ruta.
            </Typography>
          )}
        </Box>
      ) : (
        <>
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
                onChange={(e) =>
                  setFilters({ ...filters, dia: e.target.value })
                }
                sx={{ width: 70 }}
              />
              <TextField
                size="small"
                label="Mes"
                value={filters.mes}
                onChange={(e) =>
                  setFilters({ ...filters, mes: e.target.value })
                }
                sx={{ width: 70 }}
              />
              <TextField
                size="small"
                label="Año"
                value={filters.anio}
                onChange={(e) =>
                  setFilters({ ...filters, anio: e.target.value })
                }
                sx={{ width: 90 }}
              />
            </Box>
          </Box>

          {/* Tabla de rutas */}
          <Box sx={{ flex: 1, overflowX: "auto", px: 2, pb: 2 }}>
            {loading ? (
              <Typography align="center" sx={{ mt: 2 }}>
                Cargando rutas...
              </Typography>
            ) : noResults ? (
              <Typography
                variant="body2"
                color="error"
                align="center"
                sx={{ mt: 2, fontWeight: "600" }}
              >
                No se encontraron rutas para esta fecha
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Manifiesto</TableCell>
                    <TableCell>Fecha inicio / fin</TableCell>
                    <TableCell>Total Paquetes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((ruta, i) => (
                    <TableRow
                      key={i}
                      hover
                      onClick={() => setSelectedRuta(ruta)} // 👈 cambia a vista de paquetes
                      sx={{
                        "&:hover": {
                          bgcolor: "action.hover",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="primary"
                          fontWeight="500"
                        >
                          {ruta.cod_manifiesto}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(ruta.fecha_inicio).toLocaleDateString()} /{" "}
                          {ruta.fecha_fin
                            ? new Date(ruta.fecha_fin).toLocaleDateString()
                            : "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {ruta.paquete?.length ?? 0}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ModalHistorial;
