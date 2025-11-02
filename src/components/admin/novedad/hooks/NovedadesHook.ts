// hooks/presentation/useNoveltyLogic.ts
import { useState } from "react";
import { Novelty } from "../../../../global/types/novedades";

export const useNoveltyLogic = () => {
  const [selectedNovelty, setSelectedNovelty] = useState<Novelty | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Ver imagen
  const handleViewImage = (novelty: Novelty) => {
    setSelectedNovelty(novelty);
    setIsImageModalOpen(true);
  };

  // Cerrar modal de imagen
  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedNovelty(null);
  };

  return {
    selectedNovelty,
    isImageModalOpen,
    handleViewImage,
    handleCloseImageModal,
  };
};