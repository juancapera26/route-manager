import React, { useState } from "react";
import { Paper, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Formulario from "./modalRutas/Formulario";
import InicioRuta from "./modalRutas/InicioRuta";
import ListaPaquetes from "./modalRutas/ListaPaquetes";
import VistaMinimizada from "./modalRutas/VistaMinimizada";
import { Paquete } from "../../../hooks/useManifiestos";
import useAuth from "../../../hooks/useAuth";
import { API_URL } from "../../../config";

interface ModalRutasProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

enum Steps {
  Formulario,
  Minimizada,
  Colapsada,
  Expandida,
}

const ModalRutas: React.FC<ModalRutasProps> = ({
  isOpen,
  onClose,
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  const [codigo, setCodigo] = useState("");
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [codigoManifiesto, setCodigoManifiesto] = useState("");
  const [vehiculo, setVehiculo] = useState("");
  const [mostrarLetras, setMostrarLetras] = useState(false);
  const [activeStep, setActiveStep] = useState<Steps>(Steps.Formulario);
  const [mensajeError, setMensajeError] = useState("");
  const [loading, setLoading] = useState(false);

  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const { getAccessToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo) {
      setMensajeError("El código es obligatorio");
      return;
    }

    setLoading(true);
    setMensajeError("");

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Usuario no autenticado.");

      const response = await fetch(`${API_URL}/api/manifiestos/${codigo}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        throw new Error(
          "No tienes permiso para ver los paquetes de este manifiesto."
        );
      }

      if (response.status === 404) {
        throw new Error("No se encontró el manifiesto con ese código.");
      }

      if (!response.ok) throw new Error("Error al consultar el manifiesto.");

      const data: {
        codigo: string;
        estado_ruta: string;
        paquetes: Paquete[];
        vehiculo: string; 
      } = await response.json();

      // Validación de estado de la ruta
      if (data.estado_ruta === "Completada") {
        setMensajeError("Esta ruta ya está completada.");
        return;
      }

      if (data.estado_ruta === "Pendiente") {
        setMensajeError("Esta ruta todavía no se encuentra disponible.");
        return;
      }

      if (!data.paquetes || data.paquetes.length === 0) {
        setMensajeError("No se encontraron paquetes para este manifiesto.");
        return;
      }

      // Guardamos paquetes y datos extra
      setPaquetes(data.paquetes);
      setCodigoManifiesto(data.codigo);
      setVehiculo(data.vehiculo);
      setActiveStep(Steps.Expandida);
    } catch (err) {
      setMensajeError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

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
    [Steps.Colapsada]: (
      <InicioRuta
        mostrarLetras={mostrarLetras}
        letras={letras}
        onNextStep={() => setActiveStep(Steps.Expandida)}
        onPrevStep={() => setActiveStep(Steps.Minimizada)}
        codigoManifiesto={codigoManifiesto} 
        vehiculo={vehiculo}
      />
    ),
    [Steps.Expandida]: (
      <ListaPaquetes
        paquetes={paquetes}
        mostrarLetras={mostrarLetras}
        letras={letras}
        onIniciarRuta={() => {
          setMostrarLetras(true);
          setActiveStep(Steps.Colapsada);
          localStorage.setItem("paquetesRuta", JSON.stringify(paquetes));
          window.dispatchEvent(new Event("paquetesRutaUpdated"));
        }}
        codigoManifiesto={codigoManifiesto}
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
            if (activeStep === Steps.Formulario) {
              onClose();
            } else {
              const confirmar = window.confirm(
                "¿Está seguro que desea cancelar la ruta y volver a ingresar el manifiesto?"
              );

              if (confirmar) {
                setCodigo("");
                setPaquetes([]);
                setMostrarLetras(false);
                setMensajeError("");
                setCodigoManifiesto("");
                setVehiculo("");
                setActiveStep(Steps.Formulario);

                localStorage.removeItem("paquetesRuta");
                window.dispatchEvent(new Event("paquetesRutaUpdated"));
              }
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
