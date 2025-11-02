// src/pages/admin/PackagesManagement.tsx
import React, { useState, useMemo } from "react";
import { DataTable } from "../../components/ui/table/DataTable";
import { usePackagesManagementHook } from "../../components/admin/packages/hooks/packagesHook";
import EstadoFilterDropdown from "../../components/common/EstadoFilter";
import ModalAgregarPaquete from "../../components/admin/packages/ModalAgregarPaquete";
import ModalEditarPaquete from "../../components/admin/packages/ModalEditarPaquete";
import { ModalDetallesPaquetes } from "../../components/admin/packages/ModalDetallesPaquetes";
import { ModalAsignarPaquete } from "../../components/admin/packages/ModalAsignarPaquete";
import Badge, { BadgeColor } from "../../components/ui/badge/Badge";
import { Paquete, PaquetesEstados } from "../../global/types/paquete.types";
import { Plus } from "lucide-react";

//orquestador

const PackagesManagement: React.FC = () => {
  const {
    data,
    datosFiltrados,
    loading,
    filtroEstado,
    columnsForCurrentState,
    actionsForCurrentState,
    
    // Modales existentes
    modalDetalles,
    abrirDetalles,
    cerrarDetalles,
    
    modalEdicion,
    abrirEdicion,
    cerrarEdicion,
    handleUpdateFromModal,
    
    // Modal de asignación
    modalAsignacion,
    cerrarAsignacion,
    
    // Rutas disponibles
    availableRoutes,
    
    // Handlers CRUD
    handleCreatePaquete,
    
    // ✅ Handler de asignación (ahora recibe paqueteId y dto)
    handleAssign,
  } = usePackagesManagementHook();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ CALCULAR: Paquetes por estado desde los datos
  const paquetesPorEstado = useMemo(() => {
    const grupos: Record<PaquetesEstados, Paquete[]> = {
      [PaquetesEstados.Pendiente]: [],
      [PaquetesEstados.Asignado]: [],
      [PaquetesEstados.Entregado]: [],
      [PaquetesEstados.Fallido]: [],
    };

    data.forEach((paquete) => {
      if (grupos[paquete.estado]) {
        grupos[paquete.estado].push(paquete);
      }
    });

    return grupos;
  }, [data]);

  // ✅ CALCULAR: Contadores por estado
  const contadores = useMemo(() => {
    const total = data.length;
    return {
      [PaquetesEstados.Pendiente]: paquetesPorEstado[PaquetesEstados.Pendiente].length,
      [PaquetesEstados.Asignado]: paquetesPorEstado[PaquetesEstados.Asignado].length,
      [PaquetesEstados.Entregado]: paquetesPorEstado[PaquetesEstados.Entregado].length,
      [PaquetesEstados.Fallido]: paquetesPorEstado[PaquetesEstados.Fallido].length,
      todos: total,
    };
  }, [paquetesPorEstado, data]);

  // Mapa de estados a colores de badge
  const badgeColors: Record<PaquetesEstados, BadgeColor> = {
    [PaquetesEstados.Pendiente]: "warning",
    [PaquetesEstados.Asignado]: "info",
    [PaquetesEstados.Entregado]: "success",
    [PaquetesEstados.Fallido]: "error",
  };

  // ✅ HANDLER crear paquete
  const handleCreate = async (payload: any): Promise<boolean> => {
    setSaving(true);
    try {
      const success = await handleCreatePaquete(payload);
      if (success) {
        setIsModalOpen(false);
        return true;
      }
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ✅ ACTUALIZADO: Handler para confirmar asignación desde el modal
  // Ahora recibe paqueteId y codManifiesto (string)
  const handleConfirmarAsignacion = async (paqueteId: number, codManifiesto: string) => {
    console.log('🎯 === PACKAGE MANAGEMENT ===');
    console.log('📦 Paquete ID:', paqueteId);
    console.log('📋 Código Manifiesto:', codManifiesto);
    console.log('🔍 Tipo de codManifiesto:', typeof codManifiesto);
    console.log('=============================');
    
    try {
      // ✅ Llamamos al handler con el DTO correcto
      await handleAssign(paqueteId, { cod_manifiesto: codManifiesto });
    } catch (error) {
      console.error('❌ Error en handleConfirmarAsignacion:', error);
    }
  };
 
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Gestión de Paquetes
      </h1>

      {/* ✅ MODO: Vista de todos los estados */}
      {filtroEstado.estadoSeleccionado === null ? (
        <>
          {Object.values(PaquetesEstados).map((estado) => (
            <section key={estado}>
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
                  {/* Botón solo en la primera sección */}
                  {estado === PaquetesEstados.Pendiente && (
                    <div className="order-1 sm:order-2">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                      >
                        <Plus className="w-5 h-5" />
                        {saving ? "Creando..." : "Crear Paquete"}
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
                    
                    {/* Filtro solo en la primera sección */}
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
        // ✅ MODO: Vista de un solo estado filtrado
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                  {saving ? "Creando..." : "Crear Paquete"}
                </button>
              </div>
              
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    {filtroEstado.estadoSeleccionado}
                  </h2>
                  <Badge
                    variant="light"
                    color={filtroEstado.estadoSeleccionado ? badgeColors[filtroEstado.estadoSeleccionado as PaquetesEstados] : "info"}
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

      {/* ========== MODALES ========== */}

      {/* ✅ Modal para agregar paquetes */}
      <ModalAgregarPaquete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreate}
        isLoading={saving}
      />

      {/* ✅ Modal para editar paquetes */}
      <ModalEditarPaquete
        isOpen={modalEdicion.open}
        onClose={cerrarEdicion}
        onSuccess={handleUpdateFromModal}
        paquete={modalEdicion.paquete}
        isLoading={modalEdicion.loading}
      />

      {/* ✅ Modal para ver detalles de paquetes */}
      <ModalDetallesPaquetes
        detallesPaquete={modalDetalles.paquete}
        cerrarModalDetalles={cerrarDetalles}
      />

      {/* ✅ ACTUALIZADO: Modal para asignar paquete a ruta */}
      <ModalAsignarPaquete
        isOpen={modalAsignacion.open}
        onClose={cerrarAsignacion}
        paquete={modalAsignacion.paquete}
        rutasDisponibles={availableRoutes || []}
        loading={modalAsignacion.loading}
        onConfirm={handleConfirmarAsignacion}
      />
    </div>
  );
};

export default PackagesManagement;