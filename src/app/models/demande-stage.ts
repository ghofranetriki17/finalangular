import { Designer } from "./designer";

export interface DemandeStage {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    designerId: number;
    message?: string;
    dateCreation: string;
    statut: 'en_attente' | 'accepte' | 'refuse';
    designer?: Designer;
  }