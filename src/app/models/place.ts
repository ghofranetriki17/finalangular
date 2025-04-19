export interface Place {
    id: number;
    defileId: number;
    numero: string;
    statut: 'disponible' | 'reserve' | 'occupe';
    reservationId?: number;
  }