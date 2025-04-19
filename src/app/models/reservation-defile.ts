import { Client } from "./client";
import { Defile } from "./defile";
import { Place } from "./place";

export interface ReservationDefile {
    id: number;
    clientId: number;
    defileId: number;
    dateReservation: string;
    nbPlaces: number;
    placesIds: number[];
    client?: Client;
    defile?: Defile;
    places?: Place[];
  }