// src/pages/admin/VehiclesManagement.tsx
import React, { useState } from 'react';
import { useVehiclesManagement } from '../../components/admin/vehicles/hooks/vehiclesHook';
import ModalAgregarVehiculo from '../../components/admin/vehicles/ModalAgregarVehiculo';
import { ModalDetallesVehiculo } from '../../components/admin/vehicles/ModalDetallesVehiculo';
import ModalEditarVehiculo from '../../components/admin/vehicles/ModalEditarVehiculo';
import TablaVehiculos from '../../components/admin/vehicles/TablaVehiculos';
import Alert from '../../components/ui/alert/Alert';
import Button from '../../components/ui/button/Button';
import { EstadoVehiculo, TipoVehiculo } from '../../global/types/vehiclesType';
import { Plus, Truck, Filter } from 'lucide-react';

const VehiclesManagement: React.FC = () => {
  // Hook principal de gestión
  const {
    vehiculos,
    vehiculosDisponibles,
    vehiculosNoDisponibles,
    loading,
    error,
    modalAgregarState,
    modalDetallesState,
    modalEditarState,
    alertState,
    abrirModalAgregar,
    cerrarModalAgregar,
    abrirModalDetalles,
    cerrarModalDetalles,
    abrirModalEditar,
    cerrarModalEditar,
    handleCreateVehiculo,
    handleUpdateVehiculo,
    handleDeleteVehiculo,
    handleCambiarEstado,
    refetch,
  } = useVehiclesManagement();

  // Estados locales para filtros
  const [filtroEstado, setFiltroEstado] = useState<EstadoVehiculo | 'todos'>('todos');
  const [filtroTipo, setFiltroTipo] = useState<TipoVehiculo | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * Aplicar filtros a la lista de vehículos
   */
  const vehiculosFiltrados = React.useMemo(() => {
    let resultado = [...vehiculos];

    // Filtrar por estado
    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(v => v.estado_vehiculo === filtroEstado);
    }

    // Filtrar por tipo
    if (filtroTipo !== 'todos') {
      resultado = resultado.filter(v => v.tipo === filtroTipo);
    }

    // Filtrar por búsqueda (placa o ID)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      resultado = resultado.filter(
        v =>
          v.placa.toLowerCase().includes(term) ||
          v.id_vehiculo.toLowerCase().includes(term)
      );
    }

    return resultado;
  }, [vehiculos, filtroEstado, filtroTipo, searchTerm]);

  /**
   * Limpiar todos los filtros
   */
  const limpiarFiltros = () => {
    setFiltroEstado('todos');
    setFiltroTipo('todos');
    setSearchTerm('');
  };

  /**
   * Contar vehículos por tipo
   */
  const contadorPorTipo = React.useMemo(() => {
    return {
      moto: vehiculos.filter(v => v.tipo === TipoVehiculo.Moto).length,
      camioneta: vehiculos.filter(v => v.tipo === TipoVehiculo.Camioneta).length,
      furgon: vehiculos.filter(v => v.tipo === TipoVehiculo.Furgon).length,
      camion: vehiculos.filter(v => v.tipo === TipoVehiculo.Camion).length,
    };
  }, [vehiculos]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Truck className="w-8 h-8 text-blue-500" />
              Gestión de Vehículos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Administra los vehículos de tu flota
            </p>
          </div>
          <Button
            variant="primary"
            onClick={abrirModalAgregar}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar Vehículo
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {alertState.show && alertState.msg && (
        <Alert
          variant={alertState.type || 'info'}
          title={
            alertState.type === 'success'
              ? 'Éxito'
              : alertState.type === 'error'
              ? 'Error'
              : alertState.type === 'warning'
              ? 'Advertencia'
              : 'Información'
          }
          message={alertState.msg}
          className="mb-6"
        />
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Total de vehículos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Vehículos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {vehiculos.length}
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Truck className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Vehículos disponibles */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Disponibles</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-500 mt-1">
                {vehiculosDisponibles.length}
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Vehículos no disponibles */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">No Disponibles</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-500 mt-1">
                {vehiculosNoDisponibles.length}
              </p>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tipo más común */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tipo más común</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {contadorPorTipo.moto >= Math.max(contadorPorTipo.camioneta, contadorPorTipo.furgon, contadorPorTipo.camion)
                  ? 'Moto'
                  : contadorPorTipo.camioneta >= Math.max(contadorPorTipo.furgon, contadorPorTipo.camion)
                  ? 'Camioneta'
                  : contadorPorTipo.furgon >= contadorPorTipo.camion
                  ? 'Furgón'
                  : 'Camión'}
              </p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Filter className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <form className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Placa o ID..."
              className="w-full h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as EstadoVehiculo | 'todos')}
              className="w-full h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value={EstadoVehiculo.Disponible}>Disponibles</option>
              <option value={EstadoVehiculo.NoDisponible}>No Disponibles</option>
            </select>
          </div>

          {/* Filtro por tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as TipoVehiculo | 'todos')}
              className="w-full h-10 px-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value={TipoVehiculo.Moto}>Moto</option>
              <option value={TipoVehiculo.Camioneta}>Camioneta</option>
              <option value={TipoVehiculo.Furgon}>Furgón</option>
              <option value={TipoVehiculo.Camion}>Camión</option>
            </select>
          </div>

          {/* Botón limpiar filtros */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={limpiarFiltros}
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Indicador de resultados */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Mostrando {vehiculosFiltrados.length} de {vehiculos.length} vehículos
        </div>
      </form>

      {/* Tabla de vehículos */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <Alert
          variant="error"
          title="Error"
          message={error}
          className="mb-6"
        />
      ) : (
        <TablaVehiculos
          vehiculos={vehiculosFiltrados}
          onVerDetalles={abrirModalDetalles}
          onEditar={abrirModalEditar}
          onEliminar={handleDeleteVehiculo}
          onCambiarEstado={handleCambiarEstado}
        />
      )}

      {/* Modales */}
      <ModalAgregarVehiculo
        isOpen={modalAgregarState.isOpen}
        onClose={cerrarModalAgregar}
        onSuccess={handleCreateVehiculo}
        isLoading={modalAgregarState.isLoading}
      />

      <ModalDetallesVehiculo
        isOpen={modalDetallesState.isOpen}
        onClose={cerrarModalDetalles}
        vehiculo={modalDetallesState.vehiculo}
      />

      <ModalEditarVehiculo
        isOpen={modalEditarState.isOpen}
        onClose={cerrarModalEditar}
        onSuccess={handleUpdateVehiculo}
        vehiculo={modalEditarState.vehiculo}
        isLoading={modalEditarState.isLoading}
      />
    </div>
  );
};

export default VehiclesManagement;