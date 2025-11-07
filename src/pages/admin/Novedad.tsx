// pages/NoveltyManagement.tsx
import React from "react";
import { useNovelty } from "../../hooks/admin/useNovedades";
import { useNoveltyLogic } from "../../components/admin/novedad/hooks/NovedadesHook";
import NoveltyTable from "../../components/admin/novedad/tablaNovedades";
import ModalVerImagen from "../../components/admin/novedad/ModalImagenNovedades";
import { FileText } from "lucide-react";

// Gestión de novedades

export const NoveltyManagement: React.FC = () => {
  const { novelties, isLoading, deleteNovelty } = useNovelty();

  const {
    selectedNovelty,
    isImageModalOpen,
    handleViewImage,
    handleCloseImageModal,
  } = useNoveltyLogic();

  return (
    <div className="min-h-screen bg-[#1A2332] p-6">  {/* ← CAMBIÉ ESTE COLOR */}
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestión de Novedades
          </h1>
          <p className="text-gray-400">
            Visualiza y gestiona las novedades reportadas por los conductores
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-[#0F1623] rounded-xl shadow-lg p-6 mb-6 border border-[#2A3441]">  {/* ← Y ESTE */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total de novedades</p>
              <p className="text-4xl font-bold text-white">
                {novelties.length}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <NoveltyTable
          novelties={novelties}
          onViewDetails={handleViewImage}
          onViewImage={handleViewImage}
          onDelete={deleteNovelty}
          isLoading={isLoading}
        />

        {/* Modal de Imagen */}
        {isImageModalOpen && (
          <ModalVerImagen
            imagenUrl={selectedNovelty?.imagen || null}
            onClose={handleCloseImageModal}
          />
        )}
      </div>
    </div>
  );
};