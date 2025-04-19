import { Membre } from "./membre";

// src/app/models/designer.model.ts
export interface Designer {
    id: number;  // Même ID que le membre correspondant
    membreId: number;
    specialite: string;
    anneesExperience: number;
    membre?: Membre;
  }
  