import React, {useState} from "react";
import Alert from "../../components/ui/alert/Alert";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Badge from "../../components/ui/badge/Badge";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 space-y-10">
      {/* --- ALERTS --- */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Alerts</h2>
        <div className="grid gap-4">
          <Alert
            variant="success"
            title="Operación exitosa"
            message="Tu acción se completó correctamente."
            showLink
            linkHref="#"
            linkText="Ver detalles"
          />
          <Alert
            variant="error"
            title="Error encontrado"
            message="Algo salió mal. Inténtalo de nuevo."
            showLink
            linkHref="#"
            linkText="Reintentar"
          />
          <Alert
            variant="warning"
            title="Advertencia"
            message="Revisa esta información antes de continuar."
            showLink
            linkHref="#"
            linkText="Leer más"
          />
          <Alert
            variant="info"
            title="Información"
            message="Aquí tienes algunos datos adicionales."
            showLink
            linkHref="#"
            linkText="Aprender más"
          />
        </div>
      </section>

      {/* --- BADGES --- */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Badges</h2>
        <div className="space-y-6">
          {/* Light Variant */}
          <div>
            <h3 className="text-sm font-medium mb-2">Light</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="light" color="primary">Primary</Badge>
              <Badge variant="light" color="success">Success</Badge>
              <Badge variant="light" color="error">Error</Badge>
              <Badge variant="light" color="warning">Warning</Badge>
              <Badge variant="light" color="info">Info</Badge>
              <Badge variant="light" color="light">Light</Badge>
              <Badge variant="light" color="dark">Dark</Badge>
            </div>
          </div>

          {/* Solid Variant */}
          <div>
            <h3 className="text-sm font-medium mb-2">Solid</h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="solid" color="primary">Primary</Badge>
              <Badge variant="solid" color="success">Success</Badge>
              <Badge variant="solid" color="error">Error</Badge>
              <Badge variant="solid" color="warning">Warning</Badge>
              <Badge variant="solid" color="info">Info</Badge>
              <Badge variant="solid" color="light">Light</Badge>
              <Badge variant="solid" color="dark">Dark</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODAL DE EJEMPLO --- */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Modal + Button</h2>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          startIcon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          Abrir Modal
        </Button>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Título del Modal</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Contenido dentro del modal.
            </p>

            <div className="flex gap-3">
              <Button variant="primary" onClick={() => alert("Acción confirmada")}>
                Confirmar
              </Button>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      </section>
    </div>
  );
};

export default App;
