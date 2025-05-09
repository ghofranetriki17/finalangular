import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Collection } from '../../models/collection';
import { Defile } from '../../models/defile';
import { Formation } from '../../models/formation';
import { DemandeStage } from '../../models/demande-stage';
import { ReservationDefile } from '../../models/reservation-defile';
import { Place } from '../../models/place';
import { Client } from 'src/app/models/client';
import { Designer } from 'src/app/models/designer';
import { Stagiaire } from 'src/app/models/stagiaire';
import { Membre } from 'src/app/models/membre';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  delete(arg0: string, id: number) {
    throw new Error('Method not implemented.');
  }
  getAll(arg0: string) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Collections
  getCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.apiUrl}/collections`);
  }

  getCollectionsByDesigner(designerId: number): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.apiUrl}/collections?designerId=${designerId}`);
  }

  getCollection(id: number): Observable<Collection> {
    return this.http.get<Collection>(`${this.apiUrl}/collections/${id}`);
  }

  createCollection(collection: Collection): Observable<Collection> {
    return this.http.post<Collection>(`${this.apiUrl}/collections`, collection);
  }

  updateCollection(collection: Collection): Observable<Collection> {
    return this.http.put<Collection>(`${this.apiUrl}/collections/${collection.id}`, collection);
  }

  deleteCollection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/collections/${id}`);
  }
  createPlace(place: any) {
    return this.http.post(`${this.apiUrl}/places`, place);
  }  

  // Défilés
  getDefiles(): Observable<Defile[]> {
    return this.http.get<Defile[]>(`${this.apiUrl}/defiles`);
  }

  getDefile(id: number): Observable<Defile> {
    return this.http.get<Defile>(`${this.apiUrl}/defiles/${id}`);
  }

  // Places
  getPlacesByDefile(defileId: number): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.apiUrl}/places?defileId=${defileId}`);
  }

  updatePlace(place: Place): Observable<Place> {
    return this.http.put<Place>(`${this.apiUrl}/places/${place.id}`, place);
  }

  // Réservations de défilés
  createReservation(reservation: ReservationDefile): Observable<ReservationDefile> {
    return this.http.post<ReservationDefile>(`${this.apiUrl}/reservations-defiles`, reservation);
  }

  // Demandes de stage
  createDemandeStage(demande: DemandeStage): Observable<DemandeStage> {
    return this.http.post<DemandeStage>(`${this.apiUrl}/demandes-stages`, demande);
  }

  getDemandesStage(): Observable<DemandeStage[]> {
    return this.http.get<DemandeStage[]>(`${this.apiUrl}/demandes-stages`);
  }

  updateDemandeStage(demande: DemandeStage): Observable<DemandeStage> {
    return this.http.put<DemandeStage>(`${this.apiUrl}/demandes-stages/${demande.id}`, demande);
  }

  // Formations
  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/formations`);
  }

  createFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(`${this.apiUrl}/formations`, formation);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients`, client);
  }
  
  getDesigners(): Observable<Designer[]> {
    return this.http.get<Designer[]>(`${this.apiUrl}/designers`);
  }
  createCollectionWithImages(formData: FormData): Observable<any> {
    return this.http.post('/api/collections', formData);
  }
  
  updateCollectionWithImages(id: number, formData: FormData): Observable<any> {
    return this.http.put(`/api/collections/${id}`, formData);
  }



  // In api.service.ts
// Add these methods to the ApiService class

// Stagiaires
getStagiaires(): Observable<Stagiaire[]> {
  return this.http.get<Stagiaire[]>(`${this.apiUrl}/stagiaires`);
}

getStagiaire(id: number): Observable<Stagiaire> {
  return this.http.get<Stagiaire>(`${this.apiUrl}/stagiaires/${id}`);
}

createStagiaire(stagiaire: Stagiaire): Observable<Stagiaire> {
  return this.http.post<Stagiaire>(`${this.apiUrl}/stagiaires`, stagiaire);
}

updateStagiaire(stagiaire: Stagiaire): Observable<Stagiaire> {
  return this.http.put<Stagiaire>(`${this.apiUrl}/stagiaires/${stagiaire.id}`, stagiaire);
}

deleteStagiaire(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/stagiaires/${id}`);
}

// For getting stagiaires by designer (tutor)
getStagiairesByDesigner(designerId: number): Observable<Stagiaire[]> {
  return this.http.get<Stagiaire[]>(`${this.apiUrl}/stagiaires?designerTuteurId=${designerId}`);
}





// Ajouter ces méthodes à votre src/app/core/services/api.service.ts

// Défilés
createDefile(defile: Defile): Observable<Defile> {
  return this.http.post<Defile>(`${this.apiUrl}/defiles`, defile);
}

updateDefile(defile: Defile): Observable<Defile> {
  return this.http.put<Defile>(`${this.apiUrl}/defiles/${defile.id}`, defile);
}

deleteDefile(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/defiles/${id}`);
}

// Réservations défilés
getReservationsByDefile(defileId: number): Observable<ReservationDefile[]> {
  return this.http.get<ReservationDefile[]>(`${this.apiUrl}/reservations-defiles?defileId=${defileId}&_expand=client&_expand=defile`);
}

getReservationsWithDetails(): Observable<ReservationDefile[]> {
  return this.http.get<ReservationDefile[]>(`${this.apiUrl}/reservations-defiles?_expand=client&_expand=defile`);
}

getReservation(id: number): Observable<ReservationDefile> {
  return this.http.get<ReservationDefile>(`${this.apiUrl}/reservations-defiles/${id}?_expand=client&_expand=defile`);
}



// Add these methods to your ApiService if needed:

getMembre(id: number): Observable<Membre> {
  return this.http.get<Membre>(`${this.apiUrl}/membres/${id}`);
}
getMembres(): Observable<Membre[]> {
  return this.http.get<Membre[]>(`${this.apiUrl}/membres`);
}

createMembre(membre: Membre): Observable<Membre> {
  return this.http.post<Membre>(`${this.apiUrl}/membres`, membre);
}

updateMembre(membre: Membre): Observable<Membre> {
  return this.http.put<Membre>(`${this.apiUrl}/membres/${membre.id}`, membre);
}
}