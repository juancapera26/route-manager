import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Slide,
  SlideProps,
} from "@mui/material";
import {
  Package,
  MapPin,
  Phone,
  User,
  FileText,
  CheckCircle,
  X as CloseIcon,
  UploadCloud,
} from "lucide-react";
import useDelivery from "../hooks/useDelivery";
import { DeliveryFormData } from "../../../global/types/deliveries";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  initial?: Partial<DeliveryFormData>;
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export default function FormDelivery({
  open,
  onClose,
  onSubmitSuccess,
  initial,
}: Props) {
  const {
    formData,
    deliveryPhoto,
    errors,
    setShowConfirmModal,
    handleInputChange,
    handleFileChange,
    handleFinalSubmit,
    clearPhoto,
  } = useDelivery({ initial, onSubmitSuccess, onClose });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "warning">(
    "success"
  );

  // 🔹 Cierra todo (solo al usar la X o Cancelar)
  const handleClose = () => {
    clearPhoto();
    setShowConfirmModal(false);
    onClose();
  };

  // 🔹 Validación antes de confirmar
  const handleFinalConfirm = async () => {
    if (!deliveryPhoto) {
      setSnackbarMsg("⚠️ Debes adjuntar una foto antes de confirmar.");
      setSnackbarType("warning");
      setOpenSnackbar(true);
      return;
    }

    if (!formData.deliveryNotes.trim()) {
      setSnackbarMsg(
        "⚠️ Debes escribir una nota de entrega antes de confirmar."
      );
      setSnackbarType("warning");
      setOpenSnackbar(true);
      return;
    }

    // Si todo está correcto → envía
    const success = await handleFinalSubmit();
    if (success) {
      handleClose();
      setSnackbarMsg("✅ Paquete registrado como entregado");
      setSnackbarType("success");
      setOpenSnackbar(true);
      if (onSubmitSuccess) onSubmitSuccess();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose} // solo se cierra con X o Cancelar
        fullWidth
        maxWidth="sm"
        PaperProps={{ style: { zIndex: 1350, maxHeight: "78vh", maxWidth: "60%" } }}
      >
        {/* 🔷 Encabezado */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.dark",
            color: "white",
            py: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Package size={24} color="white" />
            <Typography variant="h6" fontWeight="bold">
              Sistema de Entrega
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label="En proceso"
              color="success"
              sx={{
                bgcolor: "success.light",
                color: "success.dark",
                fontWeight: "bold",
              }}
            />
            {/* La X siempre cierra */}
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* 🔸 Contenido */}
        <DialogContent dividers sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 2,
              minHeight: 450,
            }}
          >
            {/* 🧾 Detalles del pedido */}
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <FileText size={20} color="primary.main" />
                  <Typography variant="h6" fontWeight="bold">
                    Detalles del pedido
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: "grey.100",
                      borderRadius: 1,
                      flex: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Pedido
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {formData.orderId}
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      bgcolor: "grey.100",
                      borderRadius: 1,
                      flex: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Referencia
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {formData.reference}
                    </Typography>
                  </Paper>
                </Box>

                <Paper
                  elevation={0}
                  sx={{ p: 1.5, bgcolor: "grey.100", borderRadius: 1, mb: 2 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Contenido
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {formData.content}
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: "info.light",
                    borderRadius: 1,
                    border: 2,
                    borderColor: "info.dark",
                  }}
                >
                  <Typography variant="caption" color="text.primary">
                    Valor
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="info.dark">
                    ${formData.value}
                  </Typography>
                </Paper>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 3,
                    mb: 2,
                  }}
                >
                  <User size={20} color="primary.main" />
                  <Typography variant="h6" fontWeight="bold">
                    Información del cliente
                  </Typography>
                </Box>

                <Box sx={{ ml: 1 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                    <MapPin size={20} color="text.secondary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Dirección
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formData.address}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Phone size={20} color="text.secondary" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formData.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>

            {/* 📷 Registro de entrega */}
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  height: "100%",
                }}
              >
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle size={20} color="success.main" />
                    <Typography variant="h6" fontWeight="bold">
                      Registrar entrega
                    </Typography>
                  </Box>

                  {/* Subida de foto */}
                  <Paper
                    elevation={0}
                    sx={{
                      py: 2,
                      border: 1,
                      borderColor: deliveryPhoto ? "primary.main" : "divider",
                      borderRadius: 1,
                      bgcolor: "grey.50",
                      cursor: "pointer",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 180,
                      overflow: "hidden",
                      position: "relative",
                    }}
                    component="label"
                    htmlFor="delivery-photo-upload"
                  >
                    <input
                      accept="image/*"
                      id="delivery-photo-upload"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    {deliveryPhoto ? (
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(deliveryPhoto)}
                          alt="Vista previa"
                          style={{
                            maxHeight: 160,
                            maxWidth: "100%",
                            objectFit: "contain",
                            borderRadius: 8,
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: "center" }}>
                        <UploadCloud size={32} color="#666" />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Adjunta la evidencia de entrega
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Se requiere una foto de prueba.
                        </Typography>
                      </Box>
                    )}
                  </Paper>

                  {/* Notas */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ mb: 0.5 }}
                    >
                      Añadir notas sobre la entrega{" "}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        (máx 350 caracteres)
                      </Typography>
                    </Typography>

                    <TextField
                      fullWidth
                      multiline
                      name="deliveryNotes"
                      value={formData.deliveryNotes}
                      onChange={handleInputChange}
                      placeholder="Ejemplo: Entregado en portería..."
                      error={Boolean(errors.deliveryNotes)}
                      helperText={errors.deliveryNotes || ""}
                      sx={{
                        bgcolor: "grey.50",
                        flexGrow: 1,
                        ".MuiOutlinedInput-root": {
                          height: "100%",
                          alignItems: "flex-start",
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", textAlign: "right", mt: 0.5 }}
                    >
                      {formData.deliveryNotes.length}/350
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </DialogContent>

        {/* 🔘 Botones */}
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleFinalConfirm}
            startIcon={<CheckCircle size={20} />}
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            Confirmar Entrega
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar general */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          severity={snackbarType}
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
