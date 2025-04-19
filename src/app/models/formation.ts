import { Designer } from "./designer";

export interface Formation {
    id: number;
    designerId: number;
    titre: string;
    description?: string;
    dateDebut: string;
    duree: number;
    nbPlacesMax: number;
    designer?: Designer;
  }