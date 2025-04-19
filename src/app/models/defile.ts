import { Collection } from "./collection";
import { Place } from "./place";

export interface Defile {
    id: number;
    nom: string;
    date: string;
    lieu: string;
    nbPlacesTotal: number;
    description?: string;
    collectionId?: number;
    collection?: Collection;
    places?: Place[];
  }