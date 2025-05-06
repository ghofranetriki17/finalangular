import { Designer } from "./designer";

export interface Collection {
  id: number;
  designerId: number;
  nom: string;
  saison: string;
  type: string;
  description?: string;
  dateCreation: string;
  images?: (string)[]; // Allow both strings (existing images) and Files (new uploads)
  designer?: Designer;
}