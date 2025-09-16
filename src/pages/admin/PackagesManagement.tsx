// src/pages/admin/PackagesManagement.tsx
import React from "react";
import PageMeta from "../../components/common/PageMeta";
import EstadoFilter from "../../components/common/EstadoFilter";
import { DataTable } from "../../components/ui/table/DataTable";
import { usePackagesManagementHook } from "../../components/admin/packages/hooks/packagesHook";
import EstadoFilterDropdown from "../../components/common/EstadoFilter";

// UI
import { Add } from "@mui/icons-material";
import Button from "../../components/ui/button/Button";

const PackagesManagement: React.FC = () => {
  const {
    datosFiltrados,
    loading,
    contadores,
    filtroEstado,
    columnsForCurrentState,
    actionsForCurrentState,
  } = usePackagesManagementHook();

  return (
    <div className="space-y-8">
      {/* Meta*/}
      <PageMeta title="Gestión de Paquetes" description="" />

      {/* Encabezado + Filtros */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Paquetes</h1>
        <EstadoFilterDropdown
          opciones={filtroEstado.opciones}
          valorSeleccionado={filtroEstado.estadoSeleccionado}
          onCambio={filtroEstado.setEstadoSeleccionado}
          contadores={contadores}
        />
      </div>

      {/* Tabla de Paquetes */}
      <DataTable
        data={datosFiltrados}
        columns={columnsForCurrentState}
        actions={actionsForCurrentState}
        loading={loading}
        emptyMessage="No hay paquetes registrados"
        keyField="id_paquete"
      />
    </div>
  );
};

export default PackagesManagement;

{
  /**
  // Modal de detalles MEJORADO
  const ModalDetalles: React.FC = () => (
    <Modal isOpen={!!detallesPaquete} onClose={cerrarModalDetalles}>
      {detallesPaquete && (
        <div className="p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Detalles del Paquete
            </h3>
            <Badge
              variant="light"
              color={
                detallesPaquete.estado === PaquetesEstados.Entregado
                  ? "success"
                  : detallesPaquete.estado === PaquetesEstados.Fallido
                  ? "error"
                  : detallesPaquete.estado === PaquetesEstados.EnRuta
                  ? "primary"
                  : detallesPaquete.estado === PaquetesEstados.Asignado
                  ? "info"
                  : "warning"
              }
            >
              {detallesPaquete.estado}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del paquete 
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Información del Paquete
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ID:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.id_paquete}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tipo:
                  </span>
                  <Badge variant="light" size="sm">
                    {detallesPaquete.tipo_paquete}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Cantidad:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.cantidad}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Valor:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${detallesPaquete.valor_declarado.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Dimensiones y peso
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Dimensiones
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Largo:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.largo} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Ancho:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.ancho} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Alto:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.alto} cm
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Peso:
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {detallesPaquete.dimensiones.peso} kg
                  </span>
                </div>
              </div>
            </div>

            {/* Información del destinatario
            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Información del Destinatario
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Nombre completo
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.nombre}{" "}
                    {detallesPaquete.destinatario.apellido}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Teléfono
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.telefono}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Correo electrónico
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.correo}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Dirección
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.destinatario.direccion}
                  </p>
                </div>
              </div>
            </div>

            {/* Fechas 
            <div className="md:col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Fechas Importantes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Fecha de registro
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {new Date(
                      detallesPaquete.fecha_registro
                    ).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Fecha de entrega
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.fecha_entrega
                      ? new Date(
                          detallesPaquete.fecha_entrega
                        ).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Pendiente"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {detallesPaquete.estado === PaquetesEstados.Entregado && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Información de Entrega
              </h4>
              <div className="bg-green-50 dark:bg-green-500/10 rounded-lg p-4">
                <div className="mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Observación del conductor
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.observacion_conductor ||
                      "Sin observaciones"}
                  </p>
                </div>
                {detallesPaquete.imagen_adjunta && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                      Prueba de entrega
                    </span>
                    <img
                      src={"/public/images/evidence/evidence.jpg"}
                      alt="Prueba de entrega"
                      className="max-h-48 rounded-lg shadow-theme-sm border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {detallesPaquete.estado === PaquetesEstados.Fallido && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-error-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Información de Entrega
              </h4>
              <div className="bg-error-100 dark:bg-error-500/10 rounded-lg p-4">
                <div className="mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Observación del conductor
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {detallesPaquete.observacion_conductor ||
                      "Sin observaciones"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );

  // Modal para asignar rutas MEJORADO
  const ModalAsignarRuta: React.FC = () => (
    <Modal isOpen={modalState.isOpen} onClose={cerrarModal}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {modalState.action === "assign"
              ? "Asignar Paquete a Ruta"
              : "Reasignar Paquete"}
          </h3>
          <Badge variant="light" color="info">
            {rutasDisponibles.length} rutas disponibles
          </Badge>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto max-h-96">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-700">
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                  >
                    Ruta
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                  >
                    Horario
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                  >
                    Zona
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                  >
                    Paquetes
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide bg-gray-50 dark:bg-gray-900/50"
                  >
                    Acción
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rutasDisponibles.map((ruta, index) => (
                  <TableRow
                    key={ruta.id_ruta}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50/30 dark:bg-gray-800/50"
                    }`}
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-blue-500 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                            />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {ruta.id_ruta}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(ruta.horario.inicio).toLocaleTimeString(
                            "es-ES",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        <span className="text-gray-400 mx-2">-</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(ruta.horario.fin).toLocaleTimeString(
                            "es-ES",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge color="info" variant="light" size="sm">
                        {ruta.zona}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                        {ruta.paquetes_asignados.length}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        onClick={() => handleConfirmarAsignacion(ruta.id_ruta)}
                        disabled={!ruta.id_conductor_asignado}
                        variant={
                          !ruta.id_conductor_asignado ? "outline" : "primary"
                        }
                      >
                        {ruta.id_conductor_asignado
                          ? "Asignar ruta"
                          : "Sin conductor"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Modal>
  );

  {/* Arriba estan los modales 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">
            Cargando paquetes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Título principal 
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Gestión de paquetes
      </h1>

      {/* Alert - MOVIDO: Ahora aparece debajo del h1
      {alert.show && (
        <Alert
          variant={alert.type}
          title={
            alert.type === "success"
              ? "Éxito"
              : alert.type === "error"
              ? "Error"
              : alert.type === "warning"
              ? "Advertencia"
              : "Información"
          }
          message={alert.message}
          className="mb-6"
        />
      )}

      {/* Mas abajo tengo un Renderizado condicional basado en el filtro 
      {filtroEstado.estadoSeleccionado === null && (
        <>
          {/* Primera sección con filtro 
          <section>
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
                <div className="order-1 sm:order-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={saving}
                    className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                  >
                    <Add className="w-4 h-4" />
                    {saving ? "Creando..." : ""}
                  </button>
                </div>

                <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                      Pendientes
                    </h2>
                    <Badge variant="light" color="warning">
                      {paquetesPendientes.length}
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

            <TablaPaquetes
              paquetes={paquetesPendientes}
              estado={PaquetesEstados.Pendiente}
            />
            <ModalAgregarPaquete
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleAgregarPaquete}
              isLoading={saving}
            />
          </section>

          {/* Resto de secciones SIN filtro
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Asignados
              </h2>
              <Badge variant="light" color="info">
                {paquetesAsignados.length}
              </Badge>
            </div>
            <TablaPaquetes
              paquetes={paquetesAsignados}
              estado={PaquetesEstados.Asignado}
            />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                En ruta
              </h2>
              <Badge variant="light" color="primary">
                {paquetesEnRuta.length}
              </Badge>
            </div>
            <TablaPaquetes
              paquetes={paquetesEnRuta}
              estado={PaquetesEstados.EnRuta}
            />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Entregados
              </h2>
              <Badge variant="light" color="success">
                {paquetesEntregados.length}
              </Badge>
            </div>
            <TablaPaquetes
              paquetes={paquetesEntregados}
              estado={PaquetesEstados.Entregado}
            />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Fallidos
              </h2>
              <Badge variant="light" color="error">
                {paquetesFallidos.length}
              </Badge>
            </div>
            <TablaPaquetes
              paquetes={paquetesFallidos}
              estado={PaquetesEstados.Fallido}
            />
          </section>
        </>
      )}

      {/* Para cuando SÍ HAY filtro específico (cualquier estado)
      {filtroEstado.estadoSeleccionado === PaquetesEstados.Pendiente && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Add className="w-4 h-4" />
                  {saving ? "Creando..." : ""}
                </button>
              </div>

              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Pendientes
                  </h2>
                  <Badge variant="light" color="warning">
                    {paquetesPendientes.length}
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

          <TablaPaquetes
            paquetes={paquetesPendientes}
            estado={PaquetesEstados.Pendiente}
          />

          <ModalAgregarPaquete
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarPaquete}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === PaquetesEstados.Asignado && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              {/* Botón de agregar
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Add className="w-4 h-4" />
                  {saving ? "Creando..." : ""}
                </button>
              </div>

              {/* Filtro y título 
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Asignados
                  </h2>
                  <Badge variant="light" color="info">
                    {paquetesAsignados.length}
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

          <TablaPaquetes
            paquetes={paquetesAsignados}
            estado={PaquetesEstados.Asignado}
          />

          {/* Modal de agregar
          <ModalAgregarPaquete
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarPaquete}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === PaquetesEstados.EnRuta && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              {/* Botón de agregar 
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Add className="w-4 h-4" />
                  {saving ? "Creando..." : ""}
                </button>
              </div>

              {/* Filtro y título 
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    En ruta
                  </h2>
                  <Badge variant="light" color="primary">
                    {paquetesEnRuta.length}
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

          <TablaPaquetes
            paquetes={paquetesEnRuta}
            estado={PaquetesEstados.EnRuta}
          />

          {/* Modal de agregar
          <ModalAgregarPaquete
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarPaquete}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === PaquetesEstados.Fallido && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              {/* Botón de agregar 
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Add className="w-4 h-4" />
                  {saving ? "Creando..." : ""}
                </button>
              </div>

              {/* Filtro y título
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Fallidos
                  </h2>
                  <Badge variant="light" color="error">
                    {paquetesFallidos.length}
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

          <TablaPaquetes
            paquetes={paquetesFallidos}
            estado={PaquetesEstados.Fallido}
          />

          {/* Modal de agregar
          <ModalAgregarPaquete
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarPaquete}
            isLoading={saving}
          />
        </section>
      )}

      {filtroEstado.estadoSeleccionado === PaquetesEstados.Entregado && (
        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center sm:gap-8 gap-4 mb-4">
              {/* Botón de agregar
              <div className="order-1 sm:order-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={saving}
                  className="items-center px-3 py-2.5 bg-success-700 hover:bg-success-800 disabled:bg-blue-400 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Add className="w-4 h-4" />
                  {saving ? "Creando..." : ""}
                </button>
              </div>

              {/* Filtro y título 
              <div className="order-2 sm:order-1 flex flex-col sm:flex-row sm:gap-4 gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Entregados
                  </h2>
                  <Badge variant="light" color="success">
                    {paquetesEntregados.length}
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

          <TablaPaquetes
            paquetes={paquetesEntregados}
            estado={PaquetesEstados.Entregado}
          />

          {/* Modal de agregar 
          <ModalAgregarPaquete
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAgregarPaquete}
            isLoading={saving}
          />
        </section>
      )}

      {/* Modal de asignación y detalles
      <ModalAsignarRuta />
      <ModalDetalles />
    </div>
  );
};

export default PackagesManagement;
 */
}
