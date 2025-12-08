import React, { useState, useEffect } from "react";
import Alert from "../../components/ui/alert/Alert";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import { Camera } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { updateFotoPerfil } from "../../global/services/driverService";
import { API_URL } from "../../config";
import EditProfile from "./editProfile";

// Componente de carga
const CustomLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

const PerfilAdmin = () => {
  // Extracción de datos del contexto de autenticación
  const {
    nombre,
    apellido,
    correo,
    telefono,
    empresa,
    tipoDocumento,
    documento,
    foto,
    estado,
    authLoading,
    idUsuario,
    getAccessToken,
  } = useAuth() as {
    nombre: string | null;
    apellido: string | null;
    correo: string | null;
    role: string | null;
    telefono: string | null;
    empresa: string | null;
    tipoDocumento: string | null;
    documento: string | null;
    foto: string | null;
    idUsuario: number | null;
    authLoading: boolean;
    getAccessToken: () => Promise<string | null>;
    estado?: string;
  };

  // Estados locales del componente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewFoto, setPreviewFoto] = useState<string | undefined>();
  const [loadingFoto, setLoadingFoto] = useState(false);

  // Efecto para cargar la foto de perfil al montar el componente
  useEffect(() => {
    if (foto) {
      setPreviewFoto(
        foto.startsWith("http")
          ? `${foto}?t=${Date.now()}`
          : `${API_URL}/${foto}?t=${Date.now()}`
      );
    }
  }, [foto]);

  // Manejador para actualizar la foto de perfil
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !idUsuario) return;

    const file = e.target.files[0];
    const token = await getAccessToken();
    if (!token) return;

    setLoadingFoto(true);
    try {
      const updated = await updateFotoPerfil(idUsuario, file, token);
      if (updated.foto_perfil) {
        setPreviewFoto(
          updated.foto_perfil.startsWith("http")
            ? `${updated.foto_perfil}?t=${Date.now()}`
            : `${API_URL}/${updated.foto_perfil}?t=${Date.now()}`
        );
      }
      console.log("Foto de perfil actualizada en UI");
    } catch (err) {
      console.error("Error al actualizar foto:", err);
    } finally {
      setLoadingFoto(false);
    }
  };

  // Estado de carga inicial
  if (authLoading) {
    return <CustomLoader />;
  }

  // Validación: Usuario no autenticado
  if (!correo) {
    return (
      <div className="p-8">
        <Alert
          variant="error"
          title="Error al cargar perfil"
          message="No se pudo obtener el perfil del usuario. Por favor inicia sesión."
        />
      </div>
    );
  }

  const rolTexto = "Administrador";

  // Si el modal está abierto, mostrar el componente EditProfile
  if (isModalOpen) {
    return <EditProfile onVolver={() => setIsModalOpen(false)} />;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Sección principal del perfil */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <section className="flex flex-col lg:flex-row gap-12">
          {/* Columna izquierda: Avatar, Rol y Botón */}
          <div className="flex flex-col items-center gap-4 lg:w-80">
            {/* Avatar con botón para cambiar foto */}
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={previewFoto || "/default-avatar.png"}
                alt="Foto de perfil"
                className="w-32 h-32 rounded-full object-cover"
              />

              <input
                type="file"
                accept="image/*"
                id="upload-avatar"
                className="hidden"
                onChange={handleFileChange}
                disabled={loadingFoto}
              />

              <label
                htmlFor="upload-avatar"
                className="absolute bottom-0 right-0 w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg hover:from-primary-500 hover:to-primary-700 hover:shadow-xl"
              >
                {loadingFoto ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-5 h-5 text-gray-600 dark:text-gray-100 drop-shadow-md" />
                )}
              </label>
            </div>

            {/* Rol */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="light" color="primary">
                {rolTexto}
              </Badge>
              {estado && (
                <Badge variant="light" color="success">
                  {estado}
                </Badge>
              )}
            </div>

            {/* Botón Editar Perfil */}
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              className="w-full"
            >
              Editar Perfil
            </Button>
          </div>

          {/* Columna derecha: Información del usuario */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Nombre y correo */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {nombre} {apellido}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{correo}</p>
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Empresa
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide ">
                  {empresa || "Sin empresa"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Teléfono
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {telefono || "No registrado"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Tipo de documento
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {tipoDocumento || "Sin documento"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Número de documento
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {documento || "Sin documento"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PerfilAdmin;