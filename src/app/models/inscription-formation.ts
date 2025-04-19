import { Formation } from "./formation";
import { Stagiaire } from "./stagiaire";

export interface InscriptionFormation {
    id: number;
    stagiaireId: number;
    formationId: number;
    dateInscription: string;
    stagiaire?: Stagiaire;
    formation?: Formation;
  }