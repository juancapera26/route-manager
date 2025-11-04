import React, { useState } from "react";
import PerfilConductor from "../driver/modals/PerfilConductor";
import ModalEditar from "../driver/modals/ModalEditar";
import useAuth from "../../hooks/useAuth"; // 👈 hook de autenticación

const DriverProfile: React.FC = () => {
  const { nombre, apellido, correo, role, documento, empresa, telefono, foto } =
    useAuth(); // Aquí obtenemos 'foto' directamente

  const [editando, setEditando] = useState(false);

  // 🔑 Mapeo: si role es "2" muestro "Conductor"
  const roleName = role === "2" ? "Conductor" : role;

  return (
    <div className="p-6">
      {editando ? (
        <ModalEditar onVolver={() => setEditando(false)} />
      ) : (
        <PerfilConductor
          nombre={nombre || ""}
          apellido={apellido || ""}
          celular={telefono || ""}
          correo={correo || ""}
          documento={documento || ""}
          empresa={empresa?.toString() || ""}
          rol={roleName || ""}
          enLinea={true}
          foto={foto} 
          onEditar={() => setEditando(true)} 
        />
      )}
    </div>
  );
};

export default DriverProfile;
