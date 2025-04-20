// src/app/admin/defiles/reservations-list/reservations-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { ReservationDefile } from '../../../models/reservation-defile';
import { Defile } from '../../../models/defile';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss']
})
export class ReservationsListComponent implements OnInit {
  defileId!: number;
  defile: Defile | null = null;
  reservations: ReservationDefile[] = [];
  loading = true;
  displayedColumns: string[] = ['client', 'dateReservation', 'nbPlaces', 'places', 'actions'];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.defileId = +this.route.snapshot.paramMap.get('id')!;
    this.loadDefile();
    this.loadReservations();
  }

  loadDefile(): void {
    this.apiService.getDefile(this.defileId).subscribe({
      next: (defile) => {
        this.defile = defile;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du défilé', error);
        this.snackBar.open('Erreur lors du chargement du défilé', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadReservations(): void {
    this.loading = true;
    this.apiService.getReservationsByDefile(this.defileId).subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réservations', error);
        this.snackBar.open('Erreur lors du chargement des réservations', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getPlacesNumeros(places: any[]): string {
    if (!places || places.length === 0) {
      return 'Aucune place attribuée';
    }
    return places.map(place => place.numero).join(', ');
  }
}