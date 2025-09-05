import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Importaciones de tipos y APIs
import {
  Paquete,
  PaquetesEstados,
  TipoPaquete,
  Ruta,
  Conductor,
} from "../../global/dataMock";
import {
  getPaquetes,
  assignPaquete,
  reassignPaquete,
  cancelPaqueteAssignment,
  deletePaquete,
  getRutas,
  getConductores,
} from "../../global/apis";

// Componentes UI
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import Alert from "../../components/ui/alert/Alert";

// Interfaces locales
interface AlertState {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface ModalState {
  isOpen: boolean;
  paqueteId: string | null;
  action: "assign" | "reassign" | null;
}

const PackagesManagement: React.FC = () => {
  // Estados principales
  const [paquetesPendientes, setPaquetesPendientes] = useState<Paquete[]>([]);
  const [paquetesAsignados, setPaquetesAsignados] = useState<Paquete[]>([]);
  const [paquetesEnRuta, setPaquetesEnRuta] = useState<Paquete[]>([]);
  const [paquetesFallidos, setPaquetesFallidos] = useState<Paquete[]>([]);
  const [rutasDisponibles, setRutasDisponibles] = useState<Ruta[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    paqueteId: null,
    action: null,
  });
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    message: "",
    type: "info",
  });

  const navigate = useNavigate();

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [allPaquetes, rutas, conductoresList] = await Promise.all([
        getPaquetes(),
        getRutas(),
        getConductores(),
      ]);

      // Filtrar paquetes por estado
      setPaquetesPendientes(
        allPaquetes.filter((p) => p.estado === PaquetesEstados.Pendiente)
      );
      setPaquetesAsignados(
        allPaquetes.filter((p) => p.estado === PaquetesEstados.Asignado)
      );
      setPaquetesEnRuta(
        allPaquetes.filter((p) => p.estado === PaquetesEstados.EnRuta)
      );
      setPaquetesFallidos(
        allPaquetes.filter((p) => p.estado === PaquetesEstados.Fallido)
      );

      setRutasDisponibles(rutas);
      setConductores(conductoresList);
    } catch (error) {
      mostrarAlert("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const mostrarAlert = (message: string, type: AlertState["type"]) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
  };

  // Funciones de gestión de paquetes
  const handleEliminarPaquete = async (paqueteId: string) => {
    if (window.confirm("¿Estás seguro de eliminar este paquete?")) {
      try {
        const result = await deletePaquete(paqueteId);
        if (result.success) {
          mostrarAlert("Paquete eliminado correctamente", "success");
          cargarDatos();
        } else {
          mostrarAlert(result.message || "Error al eliminar", "error");
        }
      } catch (error) {
        mostrarAlert("Error al eliminar el paquete", "error");
      }
    }
  };

  const handleCancelarAsignacion = async (paqueteId: string) => {
    if (window.confirm("¿Cancelar la asignación de este paquete?")) {
      try {
        const paquete = [...paquetesAsignados, ...paquetesEnRuta].find(
          (p) => p.id_paquete === paqueteId
        );
        if (paquete && paquete.id_rutas_asignadas.length > 0) {
          const rutaId = paquete.id_rutas_asignadas[0];
          const success = await cancelPaqueteAssignment(paqueteId, rutaId);
          if (success) {
            mostrarAlert("Asignación cancelada correctamente", "success");
            cargarDatos();
          } else {
            mostrarAlert("Error al cancelar la asignación", "error");
          }
        }
      } catch (error) {
        mostrarAlert("Error al cancelar la asignación", "error");
      }
    }
  };

  const handleMonitorear = (paqueteId: string) => {
    // Simulamos redirección a página de monitoreo
    navigate(`/admin/monitoring/${paqueteId}`);
  };

  const abrirModalAsignacion = (
    paqueteId: string,
    action: "assign" | "reassign"
  ) => {
    setModalState({
      isOpen: true,
      paqueteId,
      action,
    });
  };

  const cerrarModal = () => {
    setModalState({
      isOpen: false,
      paqueteId: null,
      action: null,
    });
  };

  const handleConfirmarAsignacion = async (rutaId: string) => {
    if (!modalState.paqueteId) return;

    try {
      const ruta = rutasDisponibles.find((r) => r.id_ruta === rutaId);
      if (!ruta || !ruta.id_conductor_asignado) {
        mostrarAlert(
          "La ruta seleccionada no tiene conductor asignado",
          "error"
        );
        return;
      }

      let success = false;
      // En handleConfirmarAsignacion:
      // En handleConfirmarAsignacion, reemplaza:
      let result: any;
      if (modalState.action === "assign") {
        result = await assignPaquete(
          modalState.paqueteId,
          rutaId,
          ruta.id_conductor_asignado
        );
      } else if (modalState.action === "reassign") {
        result = await reassignPaquete(
          modalState.paqueteId,
          rutaId,
          ruta.id_conductor_asignado
        );
      }

      if (result.success) {
        mostrarAlert(
          `Paquete ${
            modalState.action === "assign" ? "asignado" : "reasignado"
          } correctamente`,
          "success"
        );
        cargarDatos();
        cerrarModal();
      } else {
        mostrarAlert(result.message || "Error en la asignación", "error");
      }
      if (success) {
        mostrarAlert(
          `Paquete ${
            modalState.action === "assign" ? "asignado" : "reasignado"
          } correctamente`,
          "success"
        );
        cargarDatos();
        cerrarModal();
      } else {
        mostrarAlert("Error en la asignación", "error");
      }
    } catch (error) {
      mostrarAlert("Error en la operación", "error");
    }
  };

  // Componente para renderizar tabla de paquetes
  const TablaPaquetes: React.FC<{
    paquetes: Paquete[];
    estado: PaquetesEstados;
  }> = ({ paquetes, estado }) => {
    if (paquetes.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay paquetes en estado: {estado}
        </div>
      );
    }

    const getColorEstado = (estado: PaquetesEstados) => {
      switch (estado) {
        case PaquetesEstados.Pendiente:
          return "warning";
        case PaquetesEstados.Asignado:
          return "info";
        case PaquetesEstados.EnRuta:
          return "primary";
        case PaquetesEstados.Entregado:
          return "success";
        case PaquetesEstados.Fallido:
          return "error";
        default:
          return "light";
      }
    };

    const getColorTipo = (tipo: TipoPaquete) => {
      switch (tipo) {
        case TipoPaquete.Fragil:
          return "error";
        case TipoPaquete.Refrigerado:
          return "info";
        case TipoPaquete.Grande:
          return "warning";
        default:
          return "light";
      }
    };

    return (
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <Table className="divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900">
              <TableCell
                isHeader
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                ID Paquete
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Destinatario
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Tipo
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Estado
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Fecha Registro
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Valor Declarado
              </TableCell>
              <TableCell
                isHeader
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paquetes.map((paquete) => (
              <TableRow
                key={paquete.id_paquete}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {paquete.id_paquete}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {paquete.destinatario.nombre} {paquete.destinatario.apellido}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    color={getColorTipo(paquete.tipo_paquete)}
                    variant="light"
                  >
                    {paquete.tipo_paquete}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Badge color={getColorEstado(paquete.estado)} variant="light">
                    {paquete.estado}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {new Date(paquete.fecha_registro).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  ${paquete.valor_declarado.toLocaleString()}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  <div className="flex space-x-2">
                    {estado === PaquetesEstados.Pendiente && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => {}}>
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleEliminarPaquete(paquete.id_paquete)
                          }
                        >
                          Eliminar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            abrirModalAsignacion(paquete.id_paquete, "assign")
                          }
                        >
                          Asignar
                        </Button>
                      </>
                    )}
                    {estado === PaquetesEstados.Asignado && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() =>
                          handleCancelarAsignacion(paquete.id_paquete)
                        }
                      >
                        Cancelar
                      </Button>
                    )}
                    {estado === PaquetesEstados.EnRuta && (
                      <Button
                        size="sm"
                        onClick={() => handleMonitorear(paquete.id_paquete)}
                      >
                        Monitorear
                      </Button>
                    )}
                    {estado === PaquetesEstados.Fallido && (
                      <Button
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() =>
                          abrirModalAsignacion(paquete.id_paquete, "reassign")
                        }
                      >
                        Reasignar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  // Modal para asignar rutas
  const ModalAsignarRuta: React.FC = () => (
    <Modal isOpen={modalState.isOpen} onClose={cerrarModal}>
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {modalState.action === "assign"
            ? "Asignar Paquete a Ruta"
            : "Reasignar Paquete"}
        </h3>

        <div className="overflow-x-auto max-h-96">
          <Table className="divide-y divide-gray-200 dark:divide-gray-700">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-900">
                <TableCell
                  isHeader
                  className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  ID Ruta
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  Horario
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  Zona
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  Paquetes
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                >
                  Acción
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rutasDisponibles.map((ruta) => (
                <TableRow
                  key={ruta.id_ruta}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <TableCell className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                    {ruta.id_ruta}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">
                    {new Date(ruta.horario.inicio).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(ruta.horario.fin).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Badge color="info" variant="light">
                      {ruta.zona}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">
                    {ruta.paquetes_asignados.length}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Button
                      size="sm"
                      onClick={() => handleConfirmarAsignacion(ruta.id_ruta)}
                      disabled={!ruta.id_conductor_asignado}
                    >
                      {ruta.id_conductor_asignado
                        ? "Seleccionar"
                        : "Sin conductor"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Modal>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Alert */}
      {alert.show && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            alert.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : alert.type === "error"
              ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
              : alert.type === "warning"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
              : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Título principal */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Gestión de paquetes
      </h1>

      {/* Sección Pendientes */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Pendientes ({paquetesPendientes.length})
        </h2>
        <TablaPaquetes
          paquetes={paquetesPendientes}
          estado={PaquetesEstados.Pendiente}
        />
      </section>

      {/* Sección Asignados */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Asignados ({paquetesAsignados.length})
        </h2>
        <TablaPaquetes
          paquetes={paquetesAsignados}
          estado={PaquetesEstados.Asignado}
        />
      </section>

      {/* Sección En Ruta */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          En ruta ({paquetesEnRuta.length})
        </h2>
        <TablaPaquetes
          paquetes={paquetesEnRuta}
          estado={PaquetesEstados.EnRuta}
        />
      </section>

      {/* Sección Fallidos */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Fallidos ({paquetesFallidos.length})
        </h2>
        <TablaPaquetes
          paquetes={paquetesFallidos}
          estado={PaquetesEstados.Fallido}
        />
      </section>

      {/* Modal de asignación */}
      <ModalAsignarRuta />
    </div>
  );
};

export default PackagesManagement;
