import React from "react";
import PerfilConductor from "../driver/PerfilConductor";

const DriverProfile: React.FC = () => {
  return (
    <div className="p-6">
      <PerfilConductor
        nombre="Juan"
        apellido="Pérez"
        celular="3001234567"
        correo="juan.perez@email.com"
        documento="CC 123456789"
        empresa="Interrapidísimo"
        rol="Conductor"
        enLinea={true}
        fotoUrl="https://via.placeholder.com/80"
      />
    </div>
  );
};

export default DriverProfile;
