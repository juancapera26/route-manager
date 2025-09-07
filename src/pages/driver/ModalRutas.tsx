import React, { useState } from "react";
import { Paper, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Formulario from "./layout_conductor/components/modalRutas/Formulario";
import VistaMinimizada from "./layout_conductor/components/modalRutas/VistaMinimizada";
import { Paquete } from "../../hooks/useManifiestos";
import ListaPaquetes from "./layout_conductor/components/modalRutas/ListaPaquetes";
import InicioRuta from "./layout_conductor/components/modalRutas/InicioRuta";

interface ModalRutasProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

// Enum para steps
enum Steps {
  Formulario,
  Minimizada,
  Colapsada,
  Expandida,
}

const ModalRutas: React.FC<ModalRutasProps> = ({
  isOpen,
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  const [codigo, setCodigo] = useState("");
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mostrarLetras, setMostrarLetras] = useState(false);
  const [activeStep, setActiveStep] = useState<Steps>(Steps.Formulario);
  const [mensajeError, setMensajeError] = useState("");
  const [loading, setLoading] = useState(false);

  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const paqueteActual = paquetes.length > 0 ? paquetes[currentIndex] : null;

  // Función de submit que consulta el backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo) {
      setMensajeError("El código es obligatorio");
      return;
    }

    setLoading(true);
    setMensajeError("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/manifiestos/${codigo}`
      );
      if (!response.ok) throw new Error("Error al consultar el manifiesto");

      const data: { codigo: string; paquetes: Paquete[] } =
        await response.json();

      if (!data.paquetes || data.paquetes.length === 0) {
        setMensajeError("No se encontraron paquetes para este código");
        return;
      }

      setPaquetes(data.paquetes);
      setActiveStep(Steps.Expandida);
    } catch (err) {
      setMensajeError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Vistas según step
  const views = {
    [Steps.Formulario]: (
      <Formulario
        codigo={codigo}
        setCodigo={setCodigo}
        handleSubmit={handleSubmit}
        mensajeError={mensajeError}
        loading={loading}
      />
    ),
    [Steps.Minimizada]: (
      <VistaMinimizada
        codigo={codigo}
        paquetes={paquetes}
        onNext={() => setActiveStep(Steps.Colapsada)}
      />
    ),
    [Steps.Colapsada]: paqueteActual && (
      <InicioRuta
        paqueteActual={paqueteActual}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        mostrarLetras={mostrarLetras}
        letras={letras}
        onNextStep={() => setActiveStep(Steps.Expandida)}
        onPrevStep={() => setActiveStep(Steps.Minimizada)}
      />
    ),
    [Steps.Expandida]: (
      <ListaPaquetes
        paquetes={paquetes}
        mostrarLetras={mostrarLetras}
        letras={letras}
        onIniciarRuta={() => {
          setMostrarLetras(true);
          setCurrentIndex(0);
          setActiveStep(Steps.Colapsada);
        }}
      />
    ),
  };

  if (!isOpen) return null;

  const leftPos = isExpanded || isHovered || isMobileOpen ? 290 : 90;

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        top: "4rem",
        left: leftPos,
        zIndex: 1300,
        bgcolor: "background.paper",
        color: "text.primary",
        transition: "left 0.3s ease",
        minWidth: 400,
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <IconButton
          onClick={() => {
            const confirmar = window.confirm(
              "¿Está seguro que desea cancelar la ruta y volver a ingresar el manifiesto?"
            );

            if (confirmar) {
              // 🔹 Limpiamos todo y volvemos al formulario
              setCodigo("");
              setPaquetes([]);
              setCurrentIndex(0);
              setMostrarLetras(false);
              setMensajeError("");
              setActiveStep(Steps.Formulario);

              // ❌ No cerramos el modal
              // onClose();
            }
          }}
          color="error"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {views[activeStep]}
    </Paper>
  );
};

export default ModalRutas;
