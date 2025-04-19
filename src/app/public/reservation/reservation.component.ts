import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { Defile } from '../../models/defile';
import { Place } from '../../models/place';
import { Client } from '../../models/client';
import { ReservationDefile } from '../../models/reservation-defile';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  defileId: number;
  defile: Defile | null = null;
  places: Place[] = [];
  reservationForm!: FormGroup;
  selectedPlaces: number[] = [];
  loading = true;
  submitting = false;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.defileId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadDefile();
    this.loadPlaces();

    // Watch for changes in number of places
    this.reservationForm.get('nbPlaces')?.valueChanges.subscribe(value => {
      if (value < this.selectedPlaces.length) {
        this.selectedPlaces = this.selectedPlaces.slice(0, value);
      }
    });
  }

  initForm(): void {
    this.reservationForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      nbPlaces: [1, [Validators.required, Validators.min(1)]]
    });
  }

  loadDefile(): void {
    this.apiService.getDefile(this.defileId).subscribe({
      next: (defile) => {
        this.defile = defile;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading defile:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadPlaces(): void {
    this.apiService.getPlacesByDefile(this.defileId).subscribe({
      next: (places) => {
        this.places = places.filter(place => place.statut === 'disponible');
      },
      error: (error) => {
        console.error('Error loading places:', error);
      }
    });
  }

  togglePlaceSelection(placeId: number): void {
    const index = this.selectedPlaces.indexOf(placeId);
    const nbPlacesRequested = this.reservationForm.get('nbPlaces')?.value;

    if (index === -1) {
      if (this.selectedPlaces.length < nbPlacesRequested) {
        this.selectedPlaces.push(placeId);
      } else {
        this.snackBar.open(`You can only select ${nbPlacesRequested} places`, 'Close', { duration: 3000 });
      }
    } else {
      this.selectedPlaces.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.reservationForm.invalid || this.selectedPlaces.length === 0) {
      this.snackBar.open('Please fill all required fields and select places', 'Close', { duration: 3000 });
      return;
    }

    this.submitting = true;

    const clientData: Client = {
      nom: this.reservationForm.value.nom,
      prenom: this.reservationForm.value.prenom,
      email: this.reservationForm.value.email,
      telephone: this.reservationForm.value.telephone || undefined,
      id: 0
    };

    this.apiService.createClient(clientData).subscribe({
      next: (createdClient) => {
        const reservationData: ReservationDefile = {
          clientId: createdClient.id,
          defileId: this.defileId,
          dateReservation: new Date().toISOString(),
          nbPlaces: this.selectedPlaces.length,
          placesIds: this.selectedPlaces,
          id: 0
        };

        this.apiService.createReservation(reservationData).subscribe({
          next: (createdReservation) => {
            this.updatePlacesStatus(createdReservation.id);
            this.snackBar.open('Reservation successful!', 'Close', { duration: 3000 });
            this.router.navigate(['/defiles']);
          },
          error: (error) => {
            console.error('Reservation error:', error);
            this.snackBar.open('Reservation failed', 'Close', { duration: 3000 });
            this.submitting = false;
          }
        });
      },
      error: (error) => {
        console.error('Client creation error:', error);
        this.snackBar.open('Reservation failed', 'Close', { duration: 3000 });
        this.submitting = false;
      }
    });
  }

  private updatePlacesStatus(reservationId: number): void {
    this.selectedPlaces.forEach(placeId => {
      const place = this.places.find(p => p.id === placeId);
      if (place) {
        place.statut = 'reserve';
        place.reservationId = reservationId;
        this.apiService.updatePlace(place).subscribe();
      }
    });
  }
}