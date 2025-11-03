import React, { useState, useEffect } from "react";
import Alert from "../../components/ui/alert/Alert";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Badge from "../../components/ui/badge/Badge";
import useAuth from "../../hooks/useAuth";
import { updateFotoPerfil } from "../../global/services/driverService";
import { API_URL } from "../../config";

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
    role,
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

  return (
    <div className="p-8 space-y-10 max-w-4xl mx-auto">
      {/* Sección principal del perfil */}
      <section className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar con botón para cambiar foto */}
        <div className="relative flex-shrink-0 w-32 h-32">
          <img
            src={previewFoto || "/default-avatar.png"}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full border-4 border-primary-500 object-cover"
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
            className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
          >
            {loadingFoto ? "..." : "📷"}
          </label>
        </div>

        {/* Información del usuario */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {nombre} {apellido}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{correo}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="light" color="primary">
                {rolTexto}
              </Badge>
              {estado && (
                <Badge variant="light" color="success">
                  {estado}
                </Badge>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Empresa:</strong> {empresa || "Sin empresa"}
              </p>
              <p>
                <strong>Tipo de documento:</strong> {tipoDocumento || "Sin documento"}
              </p>
              <p>
                <strong>Numero Documento:</strong> {documento || "Sin documento"}
              </p>
              <p>
                <strong>Teléfono:</strong> {telefono || "No registrado"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3 flex-wrap">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Editar Perfil
            </Button>
          </div>
        </div>
      </section>

      {/* Modal para editar perfil */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Editar Perfil</h2>
          <p>Funcionalidad en desarrollo...</p>
        </div>
      </Modal>
    </div>
  );
};

export default PerfilAdmin;