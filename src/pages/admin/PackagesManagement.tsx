// src/pages/admin/PackagesManagement.tsx
import React, { useState } from "react";
import { DataTable } from "../../components/ui/table/DataTable";
import { usePackagesManagementHook } from "../../components/admin/packages/hooks/packagesHook";
import EstadoFilterDropdown from "../../components/common/EstadoFilter";
import ModalAgregarPaquete from "../../components/admin/packages/ModalAgregarPaquete";
import ModalEditarPaquete from "../../components/admin/packages/ModalEditarPaquete"; // NUEVO IMPORT
import { ModalDetallesPaquetes } from "../../components/admin/packages/ModalDetallesPaquetes";
import { ModalAsignarPaquete } from "../../components/admin/packages/ModalAsignarPaquete";
import Badge, { BadgeColor } from "../../components/ui/badge/Badge";
import { PaquetesEstados } from "../../global/types";
import { Plus } from "lucide-react";

const PackagesManagement: React.FC = () => {
  const {
    datosFiltrados,
    loading,
    contadores,
    filtroEstado,
    columnsForCurrentState,
    actionsForCurrentState,
    paquetesPendientes,
    paquetesAsignados,
    paquetesEnRuta,
    paquetesEntregados,
    paquetesFallidos,
    handleCreatePaquete,
    // Estados y funciones del modal de detalles
    modalDetallesState,
    cerrarModalDetalles,
    // Estados y funciones del modal de asignación
    modalAsignacionState,
    rutasDisponiblesParaAsignacion,
    cerrarModalAsignacion,
    handleConfirmarAsignacionRuta,
    // NUEVO: Estados y funciones del modal de edición
    modalEdicionState,
    cerrarModalEdicion,
    handleUpdatePaqueteFromModal,
  } = usePackagesManagementHook();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Mapa de estados a datos
  const paquetesPorEstado: Record<PaquetesEstados, any[]> = {
    [PaquetesEstados.Pendiente]: paquetesPendientes,
    [PaquetesEstados.Asignado]: paquetesAsignados,
    [PaquetesEstados.EnRuta]: paquetesEnRuta,
    [PaquetesEstados.Entregado]: paquetesEntregados,
    [PaquetesEstados.Fallido]: paquetesFallidos,
  };

  // Mapa de estados a colores de badge
  const badgeColors: Record<PaquetesEstados, BadgeColor> = {
    [PaquetesEstados.Pendiente]: "warning",
    [PaquetesEstados.Asignado]: "info",
    [PaquetesEstados.EnRuta]: "primary",
    [PaquetesEstados.Entregado]: "success",
    [PaquetesEstados.Fallido]: "error",
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Gestión de Paquetes
      </h1>

      {filtroEstado.estadoSeleccionado === null ? (
        <>
          {Object.values(PaquetesEstados).map((estado) => (
            <section key={estado}>
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
                  {estado === PaquetesEstados.Pendiente && (
                    <div className="order-1 sm:order-2">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={saving}
                        className="inline-flex items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                      >
                        <Plus className="w-5 h-5" />
                        {saving ? "Creando..." : ""}
                      </button>
                    </div>
                  )}
                  <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        {estado}
                      </h2>
                      <Badge variant="light" color={badgeColors[estado]}>
                        {paquetesPorEstado[estado]?.length || 0}
                      </Badge>
                    </div>
                    {estado === PaquetesEstados.Pendiente && (
                      <div>
                        <EstadoFilterDropdown
                          opciones={filtroEstado.opciones}
                          valorSeleccionado={filtroEstado.estadoSeleccionado}
                          onCambio={filtroEstado.setEstadoSeleccionado}
                          contadores={contadores}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DataTable
                data={paquetesPorEstado[estado] || []}
                columns={columnsForCurrentState}
                actions={actionsForCurrentState}
                loading={loading}
                emptyMessage={`No hay paquetes ${estado.toLowerCase()} registrados`}
                keyField="id_paquete"
              />
            </section>
          ))}
        </>
      ) : (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="inline-flex items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  {saving ? "Creando..." : ""}
                </button>
              </div>
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    {filtroEstado.estadoSeleccionado}
                  </h2>
                  <Badge
                    variant="light"
                    color={badgeColors[filtroEstado.estadoSeleccionado!]}
                  >
                    {datosFiltrados.length}
                  </Badge>
                </div>
                <div>
                  <EstadoFilterDropdown
                    opciones={filtroEstado.opciones}
                    valorSeleccionado={filtroEstado.estadoSeleccionado}
                    onCambio={filtroEstado.setEstadoSeleccionado}
                    contadores={contadores}
                  />
                </div>
              </div>
            </div>
          </div>
          <DataTable
            data={datosFiltrados}
            columns={columnsForCurrentState}
            actions={actionsForCurrentState}
            loading={loading}
            emptyMessage={`No hay paquetes ${filtroEstado.estadoSeleccionado?.toLowerCase()} registrados`}
            keyField="id_paquete"
          />
        </section>
      )}

      {/* Modal para agregar paquetes */}
      <ModalAgregarPaquete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreatePaquete}
        isLoading={saving}
      />

      {/* NUEVO: Modal para editar paquetes */}
      <ModalEditarPaquete
        isOpen={modalEdicionState.isOpen}
        onClose={cerrarModalEdicion}
        onSuccess={handleUpdatePaqueteFromModal}
        paquete={modalEdicionState.paquete}
        isLoading={modalEdicionState.isLoading}
      />

      {/* Modal para ver detalles de paquetes */}
      <ModalDetallesPaquetes
        detallesPaquete={modalDetallesState.paquete}
        cerrarModalDetalles={cerrarModalDetalles}
      />

      {/* Modal para asignar paquetes a rutas */}
      <ModalAsignarPaquete
        isOpen={modalAsignacionState.isOpen}
        action={modalAsignacionState.action}
        rutasDisponibles={rutasDisponiblesParaAsignacion}
        cerrarModal={cerrarModalAsignacion}
        handleConfirmarAsignacion={handleConfirmarAsignacionRuta}
      />
    </div>
  );
};

export default PackagesManagement;