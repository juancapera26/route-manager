import React from "react";
import PerfilConductor from "../driver/modals/PerfilConductor";
import useAuth from "../../hooks/useAuth"; // 👈 importa tu hook

const DriverProfile: React.FC = () => {
  const { nombre, apellido, correo, role, documento, empresa, telefono } =
    useAuth();

  // 🔑 Mapeo: si role es "2" muestro "Conductor"
  const roleName = role === "2" ? "Conductor" : role;

  return (
    <div className="p-6">
      <PerfilConductor
        nombre={nombre || ""}
        apellido={apellido || ""}
        celular={telefono || ""} // ✅ corregido: usar telefono de useAuth
        correo={correo || ""}
        documento={documento || ""}
        empresa={empresa?.toString() || ""} // 👈 forzamos string porque PerfilConductor espera string
        rol={roleName || ""}
        enLinea={true}
      />
    </div>
  );
};

export default DriverProfile;
