import React from "react";
import  NovedadesTable  from "../../components/admin/novedad/tablaNovedades";

const NovedadesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Novedades</h1>
      <NovedadesTable />
    </div>
  );
};

export default NovedadesPage;
