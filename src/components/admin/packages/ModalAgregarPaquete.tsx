import React, { useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { TipoPaquete } from "../../../global/types/paquete.types";
import { Plus, MapPin } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface ModalAgregarPaqueteProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (payload: {
    destinatario: {
      nombre: string;
      apellido: string;
      direccion: string;
      correo: string;
      telefono: string;
    };

    tipo_paquete: TipoPaquete;
    cantidad: number;
    valor_declarado: number;
    dimensiones: {
      largo: number;
      ancho: number;
      alto: number;
      peso: number;
    };
    lat: number;
    lng: number;
    
  }) => Promise<boolean>;
  isLoading?: boolean;
}

interface FormErrors {
  nombre?: string;
  apellido?: string;
  direccion?: string;
  correo?: string;
  telefono?: string;
  cantidad?: string;
  valor_declarado?: string;
  dimensiones?: {
    largo?: string;
    ancho?: string;
    alto?: string;
    peso?: string;
  };
  remitente?: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    correo?: string;
    // ❌ empresa NO va aquí porque es opcional
  };
}

interface GeocodeResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    formatted_address: string;
  }>;
  status: string;
}

const ModalAgregarPaquete: React.FC<ModalAgregarPaqueteProps> = ({
  isOpen,
  onClose,
  onSuccess,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    correo: "",
    telefono: "",
    tipo_paquete: TipoPaquete.Pequeño,
    cantidad: 1,
    valor_declarado: 0,
    dimensiones: { largo: 0, ancho: 0, alto: 0, peso: 0 },
    // ✅ Nuevos campos del remitente
    remitente: {
      nombre: "",
      apellido: "",
      telefono: "",
      empresa: "",
      correo: "",
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [latLng, setLatLng] = useState({ lat: 0, lng: 0 });
  const [isGeocoding, setIsGeocoding] = useState(false);

  const geocodeAddress = async (
    address: string
  ): Promise<{ lat: number; lng: number } | null> => {
    setIsGeocoding(true);

    try {
      const response = await axios.get<GeocodeResponse>(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: address,
            key: "AIzaSyBp-vxE_u91t0oyjFZCao9I7Hf8UOh4I-Q",
          },
        }
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const result = response.data.results[0];
        const { lat, lng } = result.geometry.location;
        setLatLng({ lat, lng });
        toast.success(`Ubicación encontrada: ${result.formatted_address}`);
        return { lat, lng };
      } else if (response.data.status === "ZERO_RESULTS") {
        toast.error("No se encontró la dirección. Verifica que sea correcta.");
        return null;
      } else {
        toast.error(`Error de geocodificación: ${response.data.status}`);
        return null;
      }
    } catch (error) {
      console.error("Error al geocodificar:", error);
      toast.error("Error al obtener las coordenadas. Intenta nuevamente.");
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]{7,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!validateEmail(formData.correo)) {
      newErrors.correo = "Formato de correo inválido";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!validatePhone(formData.telefono)) {
      newErrors.telefono = "Formato de teléfono inválido";
    }

    if (formData.cantidad < 1) {
      newErrors.cantidad = "La cantidad debe ser mayor a 0";
    }

    if (formData.valor_declarado < 1000) {
      newErrors.valor_declarado = "El valor mínimo es 1.000 COP";
    }

    const dimensionesErrors: FormErrors["dimensiones"] = {};
    if (formData.dimensiones.largo <= 0) {
      dimensionesErrors.largo = "El largo debe ser mayor a 0";
    }
    if (formData.dimensiones.ancho <= 0) {
      dimensionesErrors.ancho = "El ancho debe ser mayor a 0";
    }
    if (formData.dimensiones.alto <= 0) {
      dimensionesErrors.alto = "El alto debe ser mayor a 0";
    }
    if (formData.dimensiones.peso <= 0) {
      dimensionesErrors.peso = "El peso debe ser mayor a 0";
    }
    if (!formData.remitente.nombre.trim()) {
  newErrors.remitente = { ...newErrors.remitente, nombre: "El nombre del remitente es requerido" };
    }
    if (!formData.remitente.apellido.trim()) {
      newErrors.remitente = { ...newErrors.remitente, apellido: "El apellido del remitente es requerido" };
    }
    if (!formData.remitente.telefono.trim()) {
      newErrors.remitente = { ...newErrors.remitente, telefono: "El teléfono del remitente es requerido" };
    } else if (!validatePhone(formData.remitente.telefono)) {
      newErrors.remitente = { ...newErrors.remitente, telefono: "Teléfono inválido" };
    }
    if (!formData.remitente.correo.trim()) {
      newErrors.remitente = { ...newErrors.remitente, correo: "El correo del remitente es requerido" };
    } else if (!validateEmail(formData.remitente.correo)) {
      newErrors.remitente = { ...newErrors.remitente, correo: "Correo inválido" };
    }

    

    if (Object.keys(dimensionesErrors).length > 0) {
      newErrors.dimensiones = dimensionesErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // ✅ Manejar campos del remitente
    if (["remitente_nombre", "remitente_telefono", "remitente_empresa", "remitente_correo"].includes(name)) {
      const field = name.replace("remitente_", "");
      setFormData((prev) => ({
        ...prev,
        remitente: { ...prev.remitente, [field]: value },
      }));
    } else if (["largo", "ancho", "alto", "peso"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        dimensiones: {
          ...prev.dimensiones,
          [name]: Math.max(0, Number(value)),
        },
      }));
    } else if (["cantidad", "valor_declarado"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: Math.max(0, Number(value)) }));
    } else if (name === "tipo_paquete") {
      setFormData((prev) => ({
        ...prev,
        tipo_paquete: value as TipoPaquete,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    const coordinates = await geocodeAddress(formData.direccion);

    if (!coordinates) {
      toast.error("No se pudieron obtener las coordenadas.");
      return;
    }

    const payload = {
  destinatario: {
    nombre: formData.nombre,
    apellido: formData.apellido,
    direccion: formData.direccion,
    correo: formData.correo,
    telefono: formData.telefono,
  },

  dimensiones: {
    largo: formData.dimensiones.largo,
    ancho: formData.dimensiones.ancho,
    alto: formData.dimensiones.alto,
    peso: formData.dimensiones.peso,
  },

  tipo_paquete: formData.tipo_paquete,
  cantidad: formData.cantidad,
  valor_declarado: formData.valor_declarado,

  lat: coordinates.lat,
  lng: coordinates.lng,

  remitente: {
    remitente_nombre: formData.remitente.nombre,
    remitente_apellido: formData.remitente.apellido,
    remitente_telefono: formData.remitente.telefono,
    remitente_correo: formData.remitente.correo,
    remitente_empresa: formData.remitente.empresa || null,
  },
};



    try {
      const success = await onSuccess(payload);

      if (success) {
        toast.success("¡Paquete creado exitosamente!");
        setFormData({
          nombre: "",
          apellido: "",
          direccion: "",
          correo: "",
          telefono: "",
          tipo_paquete: TipoPaquete.Pequeño,
          cantidad: 1,
          valor_declarado: 0,
          dimensiones: { largo: 0, ancho: 0, alto: 0, peso: 0 },
          remitente: { nombre: "", apellido: "", telefono: "", empresa: "", correo: "" },
        });
        setLatLng({ lat: 0, lng: 0 });
        setErrors({});
        onClose();
      }
    } catch (error) {
      toast.error("Error al crear el paquete");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Plus className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Agregar nuevo paquete
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos del destinatario */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Datos del destinatario
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre *</Label>
                <Input
                  name="nombre"
                  placeholder="Nombre del destinatario"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errors.nombre ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                )}
              </div>
              <div>
                <Label>Apellido *</Label>
                <Input
                  name="apellido"
                  placeholder="Apellido del destinatario"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className={errors.apellido ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.apellido && (
                  <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Label>Dirección *</Label>
              <div className="relative">
                <Input
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Ej: Calle 123 #45-67, Bogotá"
                  className={errors.direccion ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {latLng.lat !== 0 && latLng.lng !== 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <MapPin className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.direccion && (
                <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Correo electrónico *</Label>
                <Input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="ejemplo@correo.com"
                  className={errors.correo ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.correo && (
                  <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
                )}
              </div>
              <div>
                <Label>Teléfono *</Label>
                <Input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="3001234567"
                  className={errors.telefono ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.telefono && (
                  <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                )}
              </div>
            </div>
          </div>

          {/* ✅ NUEVA SECCIÓN: Datos del Remitente */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Datos del remitente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  name="remitente_nombre"
                  placeholder="Nombre del remitente"
                  value={formData.remitente.nombre}
                  onChange={handleInputChange}
                  disabled={isLoading || isGeocoding}
                />
              </div>

              <div>
                <Label>Apellido</Label>
                <Input
                  name="remitente_apellido"
                  placeholder="Apellido del remitente"
                  value={formData.remitente.apellido}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      remitente: {
                        ...prev.remitente,
                        apellido: e.target.value,
                      },
                    }))
                  }
                  disabled={isLoading || isGeocoding}
                />
              </div>
              
              <div>
                <Label>Teléfono</Label>
                <Input
                  type="tel"
                  name="remitente_telefono"
                  placeholder="3001234567"
                  value={formData.remitente.telefono}
                  onChange={handleInputChange}
                  disabled={isLoading || isGeocoding}
                />
              </div>
              <div>
                <Label>Empresa</Label>
                <Input
                  name="remitente_empresa"
                  placeholder="Nombre de la empresa"
                  value={formData.remitente.empresa}
                  onChange={handleInputChange}
                  disabled={isLoading || isGeocoding}
                />
              </div>
              <div>
                <Label>Correo</Label>
                <Input
                  type="email"
                  name="remitente_correo"
                  placeholder="remitente@mail.com"
                  value={formData.remitente.correo}
                  onChange={handleInputChange}
                  className={errors.remitente?.correo ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.remitente?.correo && (
                  <p className="text-red-500 text-xs mt-1">{errors.remitente.correo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información del paquete */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Información del paquete
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Tipo de paquete</Label>
                <select
                  name="tipo_paquete"
                  value={formData.tipo_paquete}
                  onChange={handleInputChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  disabled={isLoading || isGeocoding}
                >
                  {Object.values(TipoPaquete).map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Cantidad *</Label>
                <Input
                  type="number"
                  name="cantidad"
                  placeholder="1"
                  value={formData.cantidad === 0 ? "" : formData.cantidad}
                  onChange={handleInputChange}
                  min="1"
                  className={errors.cantidad ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.cantidad && (
                  <p className="text-red-500 text-xs mt-1">{errors.cantidad}</p>
                )}
              </div>
              <div>
                <Label>Valor declarado (COP) *</Label>
                <Input
                  type="number"
                  name="valor_declarado"
                  placeholder="50000"
                  value={
                    formData.valor_declarado === 0
                      ? ""
                      : formData.valor_declarado
                  }
                  onChange={handleInputChange}
                  min="1000"
                  className={errors.valor_declarado ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.valor_declarado && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.valor_declarado}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dimensiones */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Dimensiones del paquete
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label>Largo (cm) *</Label>
                <Input
                  type="number"
                  name="largo"
                  placeholder="0"
                  value={
                    formData.dimensiones.largo === 0
                      ? ""
                      : formData.dimensiones.largo
                  }
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.dimensiones?.largo ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.dimensiones?.largo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dimensiones.largo}
                  </p>
                )}
              </div>
              <div>
                <Label>Ancho (cm) *</Label>
                <Input
                  type="number"
                  name="ancho"
                  placeholder="0"
                  value={
                    formData.dimensiones.ancho === 0
                      ? ""
                      : formData.dimensiones.ancho
                  }
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.dimensiones?.ancho ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.dimensiones?.ancho && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dimensiones.ancho}
                  </p>
                )}
              </div>
              <div>
                <Label>Alto (cm) *</Label>
                <Input
                  type="number"
                  name="alto"
                  placeholder="0"
                  value={
                    formData.dimensiones.alto === 0
                      ? ""
                      : formData.dimensiones.alto
                  }
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.dimensiones?.alto ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.dimensiones?.alto && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dimensiones.alto}
                  </p>
                )}
              </div>
              <div>
                <Label>Peso (kg) *</Label>
                <Input
                  type="number"
                  name="peso"
                  placeholder="0"
                  value={
                    formData.dimensiones.peso === 0
                      ? ""
                      : formData.dimensiones.peso
                  }
                  onChange={handleInputChange}
                  min="0"
                  step={0.1}
                  className={errors.dimensiones?.peso ? "border-red-500" : ""}
                  disabled={isLoading || isGeocoding}
                />
                {errors.dimensiones?.peso && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dimensiones.peso}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading || isGeocoding}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || isGeocoding}
              className="min-w-[140px]"
            >
              {isGeocoding
                ? "Obteniendo ubicación..."
                : isLoading
                ? "Creando..."
                : "Crear paquete"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalAgregarPaquete;