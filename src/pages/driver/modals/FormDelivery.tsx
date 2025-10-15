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

// 👇 Transición deslizante del mensaje
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
    showConfirmModal,
    loading,
    errors,
    setShowConfirmModal,
    handleInputChange,
    handleFileChange,
    handleConfirm,
    handleFinalSubmit,
    clearPhoto,
  } = useDelivery({ initial, onSubmitSuccess, onClose });

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleClose = () => {
    clearPhoto();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{ style: { zIndex: 1350 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "primary.dark",
            color: "white",
            py: 1.5,
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
            <IconButton onClick={handleClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 2,
              minHeight: 450,
            }}
          >
            {/* Izquierda: Detalles del paquete */}
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
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="text.primary"
                  >
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

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    ml: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
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

            {/* Derecha: Registro de entrega */}
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
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <CheckCircle size={20} color="success.main" />
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="text.primary"
                    >
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
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            left: 0,
                            right: 0,
                            textAlign: "center",
                            bgcolor: "rgba(0,0,0,0.5)",
                            color: "white",
                            py: 0.5,
                          }}
                        >
                          <Typography variant="caption">
                            Haz clic para cambiar la foto
                          </Typography>
                        </Box>
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

        {/* Botones */}
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            startIcon={<CheckCircle size={20} />}
            color="primary"
            sx={{ fontWeight: "bold" }}
          >
            Confirmar Entrega
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación */}
      <Dialog
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar entrega</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas confirmar la entrega?
          </Typography>
          {errors.submit && (
            <Typography color="error">{errors.submit}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmModal(false)}>Cancelar</Button>
          <Button
            onClick={async () => {
              const result = await handleFinalSubmit();
              if (result?.ok !== false) {
                setOpenSnackbar(true);
                handleClose();
              }
              setShowConfirmModal(false);
            }}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Paquete registrado como entregado
        </Alert>
      </Snackbar>
    </>
  );
}
