import React, { useState } from "react";
import { Eye, Edit, Trash, UserCheck } from "lucide-react"; // Importar íconos de Lucide
import {
  DataTable,
  ColumnDef,
  ActionButton,
} from "../../components/ui/table/DataTable";
import ModalEditarConductor from "../../components/admin/drivers/ModalEditDriver";
import useAuth from "../../hooks/useAuth";
import useDeleteDriver from "../../hooks/admin/condutores/useDeleteDriver";
import { Conductor, UpdateConductorDto } from "../../global/types/conductores";
import ModalDeleteDriver from "../../components/admin/drivers/ModalDeleteDriver";
import { updateConductor } from "../../global/services/driverService";
import useDriver from "../../hooks/admin/condutores/useDriver";
import { ModalViewDriver } from "../../components/admin/drivers/MapScreenshotModal";
import { asignarConductor } from "../../global/services/routeService";
import { AsignarConductorDto } from "../../global/types/rutas";
import { useRoutes } from "../../hooks/admin/rutas/useRoutes";
import AssignRouteModal from "../../components/admin/drivers/ModalAsignarConductor";

const DriversManagement: React.FC = () => {
  const { data: conductores, loading, refetch } = useDriver();
  const { getAccessToken } = useAuth();
  const { rutas, refetch: refetchRutas } = useRoutes();

  const [selectedDriver, setSelectedDriver] = useState<Conductor | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false); // Se utiliza para mostrar el modal de asignación

  const {
    handleDeleteDriver,
    loading: deleting,
    error: deleteError,
  } = useDeleteDriver(refetch!);

  const handleEdit = (item: Conductor) => {
    setSelectedDriver(item);
    setOpenEditModal(true);
  };

  const handleSave = async (updated: UpdateConductorDto) => {
    if (!selectedDriver) return;
    const token = await getAccessToken();
    if (!token) return;

    try {
      await updateConductor(selectedDriver.id, updated, token);
      refetch?.(); // Refresca la lista de conductores
    } catch (error) {
      console.error("Error al actualizar conductor:", error);
    } finally {
      setOpenEditModal(false); // Cierra el modal de edición
    }
  };

  const handleDelete = (item: Conductor) => {
    setSelectedDriver(item);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDriver) return;
    await handleDeleteDriver(selectedDriver.id);
    setOpenDeleteModal(false); // Cierra el modal de eliminación
  };

  const handleView = (item: Conductor) => {
    setSelectedDriver(item);
    setOpenViewModal(true);
  };

  const handleAssign = (driver: Conductor) => {
    setSelectedDriver(driver);
    setOpenAssignModal(true); // Abre el modal de asignación
  };

  const handleSelectRoute = (routeId: number) => {
    setSelectedRouteId(routeId); // Establece el ID de la ruta seleccionada
  };

  const handleConfirmAssign = async () => {
    if (!selectedDriver || selectedRouteId === null) return;

    const data: AsignarConductorDto = { id_conductor: selectedDriver.id };
    try {
      await asignarConductor(selectedRouteId, data); // Asigna el conductor a la ruta seleccionada
      alert(" Conductor asignado correctamente!");
      refetchRutas(); 
      setOpenAssignModal(false); 
    } catch (error) {
      console.error("❌ Error al asignar conductor:", error);
      alert("Error al asignar conductor.");
    }
  };

  const columns: ColumnDef<Conductor>[] = [
    { key: "id", header: "ID", accessor: "id" },
    { key: "nombre", header: "Nombre", accessor: "nombre" },
    { key: "apellido", header: "Apellido", accessor: "apellido" },
    { key: "correo", header: "Correo", accessor: "correo" },
    { key: "telefono", header: "Teléfono", accessor: "telefono" },
    { key: "estado", header: "Estado", accessor: "estado" },
    { key: "empresa", header: "Empresa", accessor: "nombre_empresa" },
  ];

  const actions: ActionButton<Conductor>[] = [
    {
      key: "view",
      label: "Ver",
      icon: <Eye />,
      onClick: handleView,
      size: "sm",
      variant: "secondary",
    },
    {
      key: "edit",
      label: "Editar",
      icon: <Edit />,
      onClick: handleEdit,
      size: "sm",
      variant: "default",
    },
    {
      key: "assign",
      label: "Asignar a Ruta",
      icon: <UserCheck />,
      onClick: handleAssign,
      size: "sm",
      variant: "outline",
    },
    {
      key: "delete",
      label: "Eliminar",
      icon: <Trash />,
      onClick: handleDelete,
      size: "sm",
      variant: "destructive",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Gestión de Conductores</h2>

      <DataTable
        data={conductores}
        columns={columns}
        actions={actions}
        loading={loading}
        emptyMessage="No hay conductores registrados"
        keyField="id"
      />

      {/* Modal de Edición */}
      <ModalEditarConductor
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        conductor={selectedDriver}
        onSave={handleSave}
      />

      {/* Modal de Eliminación */}
      <ModalDeleteDriver
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        conductor={selectedDriver}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        error={deleteError}
      />

      {/* Modal de Vista */}
      <ModalViewDriver
        isOpen={openViewModal}
        onClose={() => setOpenViewModal(false)}
        conductor={selectedDriver}
        screenshots={[]}
      />

      {/* Modal de Asignación a Ruta */}
      <AssignRouteModal
        routes={rutas}
        onAssign={handleConfirmAssign}
        onClose={() => setOpenAssignModal(false)}
        isOpen={openAssignModal} // Pasamos el estado para controlar la visibilidad
        onSelectRoute={handleSelectRoute} // Función para seleccionar la ruta
      />
    </div>
  );
};

export default DriversManagement;
