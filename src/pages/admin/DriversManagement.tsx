// src/components/admin/drivers/TablaConductores.tsx
import React, { useState } from "react";
import {
  DriveFileRenameOutline,
  ContentPasteSearch,
  DeleteOutline,
} from "@mui/icons-material";
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

const DriversManagement: React.FC = () => {
  const { data: conductores, loading, refetch } = useDriver();
  const { getAccessToken } = useAuth();

  const [selectedDriver, setSelectedDriver] = useState<Conductor | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);

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
      refetch?.();
    } catch (error) {
      console.error("Error al actualizar conductor:", error);
    } finally {
      setOpenEditModal(false);
    }
  };

  const handleDelete = (item: Conductor) => {
    setSelectedDriver(item);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDriver) return;
    await handleDeleteDriver(selectedDriver.id);
    setOpenDeleteModal(false);
  };

  const handleView = (item: Conductor) => {
    setSelectedDriver(item);
    setOpenViewModal(true);
  };

  const columns: ColumnDef<Conductor>[] = [
    { key: "id", header: "ID", accessor: "id" },
    { key: "nomre", header: "Nombre", accessor: "nombre" },
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
      icon: <ContentPasteSearch />,
      onClick: handleView,
      size: "sm",
      variant: "secondary",
    },
    {
      key: "edit",
      label: "Editar",
      icon: <DriveFileRenameOutline />,
      onClick: handleEdit,
      size: "sm",
      variant: "default",
    },
    {
      key: "delete",
      label: "Eliminar",
      icon: <DeleteOutline />,
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

      {/* 🟦 Modal de Edición */}
      <ModalEditarConductor
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        conductor={selectedDriver}
        onSave={handleSave}
      />

      {/* 🟥 Modal de Eliminación */}
      <ModalDeleteDriver
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        conductor={selectedDriver}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        error={deleteError}
      />

      {/* 👁️ Modal de Vista */}
      <ModalViewDriver
        isOpen={openViewModal} // 👈 cambia 'open' por 'isOpen'
        onClose={() => setOpenViewModal(false)}
        conductor={selectedDriver}
        screenshots={[]} // 👈 mientras no tengas imágenes reales
      />
    </div>
  );
};

export default DriversManagement;
