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
    // Fondo que respeta el modo claro y oscuro
    <div className="min-h-screen bg-background text-foreground p-6 transition-colors duration-300">  {/* ← CAMBIÉ ESTE COLOR */}
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foregorund mb-2 flex item-center gap-2">
            <FileText className="text-primary"/>
            Gestión de Novedades
          </h1>
          <p className="text-muted-foreground">
            Visualiza y gestiona las novedades reportadas por los conductores
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-card rounded-xl shadow-lg p-6 mb-6 border border-border transition colors duration-300">  {/* ← Y ESTE */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total de novedades</p>
              <p className="text-4xl font-bold text-foreground">
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