import { ZonaRuta } from "../dataMock";

export interface RutaFormData {
  zona: ZonaRuta;
  horario: { inicio: string; fin: string };
  puntos_entrega: string;
}