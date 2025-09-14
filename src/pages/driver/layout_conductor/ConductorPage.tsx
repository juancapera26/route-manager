import React, { useState } from "react";
import ModalRutas from "../modals/ModalRutas";
import { Driver } from "../Driver";

const ConductorPage: React.FC = () => {
  const [destino, setDestino] = useState<string | null>(null);

  return (
    <>
      <ModalRutas
        isOpen={true}
        onClose={() => {}}
        isExpanded={false}
        isHovered={false}
        isMobileOpen={false}
        onIniciarRutaEnDrive={setDestino} // 👉 cuando arranco ruta, guardo destino
      />
      <Driver destino={destino} /> {/* 👉 Driver recibe el destino */}
    </>
  );
};

export default ConductorPage;
