// src/components/admin/drivers/tablaConductores.tsx
import React from 'react';
import { DriveFileRenameOutline, ContentPasteSearch, DeleteOutline } from '@mui/icons-material';

import { DataTable, ColumnDef, ActionButton } from '../../components/ui/table/DataTable';
import useDrivers from '../../hooks/admin/useDrivers';

const TablaConductores = () => {
  // El hook ya se encarga de tipar la data correctamente
  const { data: conductores, loading } = useDrivers();

  const handleEdit = (item: any) => console.log('Editar conductor:', item.id_conductor);
  const handleView = (item: any) => console.log('Ver detalles del conductor:', item.id_conductor);
  const handleDelete = (item: any) => console.log('Eliminar conductor:', item.id_conductor);
  
  // No necesitamos importar las interfaces aquí, TypeScript infiere el tipo de 'item'
  const columns: ColumnDef<any>[] = [
    {
      key: "id_conductor",
      header: "id conductor",
      accessor: "id_conductor",
    },
    {
      key: 'nombreCompleto',
      header: 'Nombre',
      accessor: (item) => `${item.nombre} ${item.apellido}`,
    },
    {
      key: 'documento',
      header: 'Documento',
      accessor: 'documento',
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      accessor: 'telefono',
    },
    {
      key: 'estado',
      header: 'Estado',
      accessor: 'estado',
    },
    {
      key: 'empresa',
      header: 'Empresa',
      accessor: 'nombre_empresa',
    },
  ];

  const actions: ActionButton<any>[] = [
    {
      key: 'view',
      label: 'Ver',
      icon: <ContentPasteSearch />,
      onClick: handleView,
      size: 'sm',
      variant: 'secondary',
    },
    {
      key: 'edit',
      label: 'Editar',
      icon: <DriveFileRenameOutline />,
      onClick: handleEdit,
      size: 'sm',
      variant: 'default',
      // Se utiliza una aserción de tipo para acceder a la propiedad de estado, garantizando seguridad sin importar el tipo
      disabled: (item: any) => item.estado === 'EnRuta',
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: <DeleteOutline />,
      onClick: handleDelete,
      size: 'sm',
      variant: 'destructive',
      visible: (item: any) => item.estado !== 'EnRuta',
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
        keyField="id_conductor"
        onRowClick={(item) => console.log('Fila clickeada:', item.nombre)}
      />
    </div>
  );
};

export default TablaConductores;