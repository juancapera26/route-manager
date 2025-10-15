import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider, // Se mantiene el import por si se usa en otro lado
  IconButton,
} from '@mui/material';
import {
  Package,
  MapPin,
  Phone,
  User,
  FileText,
  CheckCircle,
  X as CloseIcon,
  UploadCloud, 
} from 'lucide-react';

// ... (interfaces se mantienen) ...

interface FormData {
  orderId: string;
  reference: string;
  content: string;
  value: string;
  clientName: string;
  address: string;
  phone: string;
  deliveryNotes: string;
}

interface FormErrors {
  deliveryNotes?: string;
}

interface DeliveryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function DeliveryFormModal({ open, onClose, onSubmitSuccess }: DeliveryFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    orderId: '#224',
    reference: '23455U6H',
    content: 'Paquete mediano 4kg',
    value: '200,000',
    clientName: 'Nombre Apellido',
    address: 'CL 65g bis sur #78A-40',
    phone: '3181876543',
    deliveryNotes: '',
  });

  const [deliveryPhoto, setDeliveryPhoto] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDeliveryPhoto(e.target.files[0]);
    } else {
      setDeliveryPhoto(null);
  }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (formData.deliveryNotes.length > 350) {
      newErrors.deliveryNotes = 'Las notas no pueden exceder 350 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validateForm()) return;
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    
    const submitData = new window.FormData();
    submitData.append('orderData', JSON.stringify(formData));
    if (deliveryPhoto) {
      submitData.append('deliveryPhoto', deliveryPhoto);
    }

    try {
      const response = await fetch('/api/entregas', {
        method: 'POST',
        body: submitData, 
      });
      if (response.ok) {
        onSubmitSuccess();
      } else {
        console.error('Error al registrar entrega');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        // Dialog ajustado a "md"
        maxWidth="md" 
        PaperProps={{ style: { zIndex: 1350 } }}
        BackdropProps={{ style: { zIndex: 1349 } }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'primary.dark', 
          color: 'white',
          py: 1.5
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Package size={24} color="white" />
            <Typography variant="h6" fontWeight="bold">
              Sistema de Entrega
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip label="En proceso" color="success" sx={{ bgcolor: 'success.light', color: 'success.dark', fontWeight: 'bold' }} />
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Grid 
            container 
            spacing={2} 
            sx={{ 
              p: 1.5, 
              minHeight: 450, 
              alignItems: 'stretch' 
            }}
          > 
            
            {/* Lado izquierdo: Detalles del pedido (Optimizado horizontal y verticalmente) */}
            {/* @ts-ignore*/}
            <Grid item xs={12} lg={6}>
              <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FileText size={20} color="primary.main" /> 
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      Detalles del pedido
                    </Typography>
                  </Box>

                  {/* Reducimos el espaciado entre los campos de Pedido y Referencia */}
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    {/* @ts-ignore*/}
                    <Grid item xs={6}>
                      <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">Pedido</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">{formData.orderId}</Typography>
                      </Paper>
                    </Grid>
                    {/* @ts-ignore*/}
                    <Grid item xs={6}>
                      <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">Referencia</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">{formData.reference}</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Contenido</Typography>
                    <Typography variant="body1" fontWeight="600">{formData.content}</Typography>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'info.light', borderRadius: 1, border: 2, borderColor: 'info.dark' }}>
                    <Typography variant="caption" color="text.primary">Valor</Typography>
                    {/* 🚨 Cambio: Usamos h5 para reducir el espacio vertical del título del valor */}
                    <Typography variant="h5" fontWeight="bold" color="info.dark">${formData.value}</Typography>
                  </Paper>

                  {/* 🚨 Cambio: Eliminada la Divider para reducir espacio vertical innecesario */}
                  {/* <Divider sx={{ my: 2 }} /> */}

                  {/* Sección Cliente (Empujada hacia abajo por el Flexbox implícito) */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3, mb: 2 }}>
                    <User size={20} color="primary.main" />
                    <Typography variant="h6" fontWeight="bold">Información del cliente</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, ml: 1 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <MapPin size={20} color="text.secondary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Dirección</Typography>
                        <Typography variant="body1" fontWeight="600">{formData.address}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Phone size={20} color="text.secondary" />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Teléfono</Typography>
                        <Typography variant="body1" fontWeight="600">{formData.phone}</Typography>
                      </Box>
                    </Box>
                  </Box>
              </Paper>
            </Grid>
            

            {/* Lado derecho: Formulario de Registro (Estirado horizontal y verticalmente) */}
            {/* @ts-ignore*/}
            <Grid item xs={12} lg={6}>
               <Paper 
                  elevation={0} 
                  sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, height: '100%', width: '160%' }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%',
                    gap: 1.5 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <CheckCircle size={20} color="success.main" /> 
                      <Typography variant="h6" fontWeight="bold" color="text.primary">Registrar entrega</Typography>
                    </Box>
                    
                    {/* CAJA DE SUBIR FOTOS (Aprovecha el ancho) */}
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        py: 2, 
                        border: 1, 
                        borderColor: deliveryPhoto ? 'primary.main' : 'divider', 
                        borderRadius: 1, 
                        bgcolor: 'grey.50', 
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: 80, 
                      }}
                      component="label" 
                      htmlFor="delivery-photo-upload" 
                    >
                      <input
                        accept="image/*"
                        id="delivery-photo-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      {deliveryPhoto ? (
                        <Box>
                           <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                            Foto Adjunta: {deliveryPhoto.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Haz clic para cambiar.
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                           <UploadCloud size={24} color="primary.main"/>
                           <Typography variant="subtitle2" fontWeight="bold">
                            Adjunta la evidencia de entrega
                          </Typography>
                           <Typography variant="caption" color="text.secondary">
                            Se requiere una foto de prueba.
                          </Typography>
                        </Box>
                      )}
                      
                    </Paper>
                    
                    {/* Sección de Notas - Crece para llenar todo el espacio vertical sobrante */}
                    <Box sx={{ 
                      flexGrow: 1, 
                      display: 'flex', 
                      flexDirection: 'column' 
                    }}>
                      <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
                        Añadir notas sobre la entrega{' '}
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          (máx 350 caracteres)
                        </Typography>
                      </Typography>
                      <TextField 
                        fullWidth 
                        multiline 
                        name="deliveryNotes" 
                        value={formData.deliveryNotes} 
                        onChange={handleInputChange} 
                        placeholder="Ejemplo: Entregado en portería, dejado con portero..." 
                        error={Boolean(errors.deliveryNotes)} 
                        helperText={errors.deliveryNotes || ''} 
                        sx={{ 
                          bgcolor: 'grey.50', 
                          flexGrow: 1, 
                          // Fuerza al input a tomar la altura total disponible
                          '.MuiOutlinedInput-root': { height: '100%', alignItems: 'flex-start' } 
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                        {formData.deliveryNotes.length}/350
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        
        {/* Acciones del Dialog (Se mantiene igual) */}
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            startIcon={<CheckCircle size={20} />}
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            Confirmar Entrega
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación (se mantiene igual) */}
      <Dialog
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar entrega</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro que deseas confirmar la entrega?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmModal(false)}>Cancelar</Button>
          <Button onClick={handleFinalSubmit} variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}