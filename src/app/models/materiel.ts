import { Membre } from "./membre";

export interface Materiel {
    id: number;
    nom: string;
    type: 'machine' | 'tissu' | 'outil';
    dateAchat: string;
    etat: 'neuf' | 'bon' | 'à remplacer';
    disponible: boolean;
    emprunteurId?: number;
    dateRetourPrevue?: string;
    emprunteur?: Membre;
  }