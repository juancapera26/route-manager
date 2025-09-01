import React, { useState } from "react";

interface ModalRutasProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
}

const MANIFIESTO_CORRECTO = "#15967";
const centroBogota = { lat: 4.711, lng: -74.0721 };

interface Direccion {
  codigo: string;
  direccion: string;
  lat: number;
  lng: number;
}

const PAQUETES_INICIALES: Direccion[] = [
  {
    codigo: "45673456789",
    direccion: "carrera123 #13-4",
    lat: 4.625,
    lng: -74.07,
  },
  {
    codigo: "45673456780",
    direccion: "calle 100 #50-10",
    lat: 4.67,
    lng: -74.096,
  },
  {
    codigo: "45673456781",
    direccion: "avenida 68 #89-45",
    lat: 4.664,
    lng: -74.112,
  },
  {
    codigo: "45673456782",
    direccion: "calle 80 #60-30",
    lat: 4.676,
    lng: -74.103,
  },
  {
    codigo: "45673456783",
    direccion: "cra 7 #26-45",
    lat: 4.609,
    lng: -74.083,
  },
  { codigo: "45673456784", direccion: "cra 10 #80-40", lat: 4.69, lng: -74.04 },
  {
    codigo: "45673456785",
    direccion: "calle 63 #15-21",
    lat: 4.638,
    lng: -74.078,
  },
];

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const ModalRutas: React.FC<ModalRutasProps> = ({
  isOpen,
  onClose,
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [mostrarPaquetes, setMostrarPaquetes] = useState(false);
  const [mostrarLetras, setMostrarLetras] = useState(false);
  const [paquetes, setPaquetes] = useState<Direccion[]>([]);

  if (!isOpen) return null;

  const leftPos = isExpanded || isHovered || isMobileOpen ? 290 : 90;
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const ordenarDireccionesPorDistancia = () => {
    const ordenados = [...paquetes].sort((a, b) => {
      const distA = haversineDistance(
        centroBogota.lat,
        centroBogota.lng,
        a.lat,
        a.lng
      );
      const distB = haversineDistance(
        centroBogota.lat,
        centroBogota.lng,
        b.lat,
        b.lng
      );
      return distA - distB;
    });
    setPaquetes(ordenados);
    setMostrarLetras(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codigo.trim() === MANIFIESTO_CORRECTO) {
      setError("");
      setPaquetes(PAQUETES_INICIALES); // muestra sin ordenar inicialmente
      setMostrarPaquetes(true);
      setMostrarLetras(false);
    } else {
      setError("CÓDIGO NO ENCONTRADO");
      setMostrarPaquetes(false);
      setMostrarLetras(false);
      setPaquetes([]);
    }
  };

  return (
    <div
      className="fixed top-16 z-[60] bg-gray-200 dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700
       w-[400px] h-[calc(100vh-4rem)] transition-all animate-slide-in px-6 py-4 overflow-y-auto"
      style={{ left: leftPos }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
          {mostrarPaquetes
            ? "zona"
            : "ingrese el código de manifiesto para empezar a realizar la jornada"}
        </h2>
        <button
          className="text-2xl font-bold hover:text-red-600 dark:hover:text-red-400"
          onClick={onClose}
          title="Cerrar"
        >
          &times;
        </button>
      </div>
      {mostrarPaquetes && (
        <div className="mb-2 text-gray-900 dark:text-white">
          <div className="font-bold">{MANIFIESTO_CORRECTO}</div>
          <div>1/{paquetes.length}</div>
        </div>
      )}
      {!mostrarPaquetes ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            type="text"
            placeholder="Código de manifiesto"
            className={`border w-full px-2 py-1 rounded text-center text-lg text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 ${
              error ? "border-red-600" : ""
            }`}
          />
          {error && (
            <span className="text-center text-red-700 font-bold">{error}</span>
          )}
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded font-bold mx-auto"
          >
            Ingresar
          </button>
        </form>
      ) : (
        <div>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[50vh] mb-4">
            {paquetes.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-2 border-b pb-1 justify-between"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">📍</span>
                  <div>
                    <div className="text-sm">
                      Código paquete <b>{p.codigo}</b>
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-200">
                      Dirección {p.direccion}
                    </div>
                  </div>
                </div>
                {mostrarLetras && (
                  <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                    {letras[i]}
                  </span>
                )}
              </div>
            ))}
          </div>
          <button
            className="mt-2 bg-primary text-white px-4 py-2 rounded font-bold ml-auto block"
            onClick={ordenarDireccionesPorDistancia}
          >
            Empezar
          </button>
        </div>
      )}
    </div>
  );
};

export default ModalRutas;
