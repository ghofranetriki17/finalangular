import { Designer } from "./designer";
import { Membre } from "./membre";

export interface Stagiaire {
    id: number;
    membreId: number;
    designerId: number;
    dateDebut: string;
    niveau: string;
    statut: 'en_attente' | 'accepte' | 'refuse';
    membre?: Membre;
    designer?: Designer;
  }