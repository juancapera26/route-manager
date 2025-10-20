import { Modal } from "../../ui/modal";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Define la interfaz del conductor según tu estructura real
interface Conductor {
  id: number;
  nombre: string;
  apellido?: string;
  telefono?: string;
  // agrega aquí los demás campos que tenga tu modelo
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  screenshots: string[];
  conductor: Conductor | null;
}

export const ModalViewDriver = ({
  isOpen,
  onClose,
  screenshots,
  conductor,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-4">
      {/* Encabezado */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold">
          Pantallazos de la Ruta —{" "}
          <span className="font-bold">
            {conductor ? conductor.nombre : "Sin conductor"}
          </span>
        </h2>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>

      {/* Contenido */}
      {screenshots.length === 0 ? (
        <p className="text-gray-500 text-center">
          No hay pantallazos disponibles.
        </p>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {screenshots.map((img, i) => (
            <Box
              key={i}
              sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 2 }}
            >
              <img
                src={img}
                alt={`Captura ${i + 1}`}
                width={250}
                style={{ borderRadius: "8px" }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Modal>
  );
};
