export interface Membre {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    role: 'admin' | 'designer' | 'stagiaire' | 'client';
    dateInscription: string;
    uid?: string; // Pour Firebase Auth
  }