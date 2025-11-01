import { useState } from "react";

export const useNovedadesPresentacion = () => {
  // Estado para controlar si el modal está abierto o cerrado
  const [modalVisible, setModalVisible] = useState(false);

  // Estado para almacenar la imagen seleccionada
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string | null>(null);

  // Función para abrir el modal con una imagen específica
  const abrirModal = (imagenUrl: string) => {
    setImagenSeleccionada(imagenUrl);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalVisible(false);
    setImagenSeleccionada(null);
  };

  return {
    modalVisible,
    imagenSeleccionada,
    abrirModal,
    cerrarModal,
  };
};
