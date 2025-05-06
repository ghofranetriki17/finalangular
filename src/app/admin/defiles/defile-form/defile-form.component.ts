// src/app/admin/defiles/defile-form/defile-form.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Defile } from '../../../models/defile';
import { Collection } from '../../../models/collection';

@Component({
  selector: 'app-defile-form',
  templateUrl: './defile-form.component.html',
  styleUrls: ['./defile-form.component.scss']
})
export class DefileFormComponent implements OnInit {
  defileForm!: FormGroup;
  collections: Collection[] = [];
  loading = false;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<DefileFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Defile
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data.id;
    this.loadCollections();
    this.initForm();
  }

  initForm(): void {
    this.defileForm = this.fb.group({
      nom: [this.data.nom || '', [Validators.required]],
      date: [this.data.date || '', [Validators.required]],
      lieu: [this.data.lieu || '', [Validators.required]],
      nbPlacesTotal: [this.data.nbPlacesTotal || 50, [Validators.required, Validators.min(1)]],
      description: [this.data.description || ''],
      collectionId: [this.data.collectionId || null]
    });
  }

  loadCollections(): void {
    this.apiService.getCollections().subscribe({
      next: (collections) => {
        this.collections = collections;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des collections', error);
        this.snackBar.open('Erreur lors du chargement des collections', 'Fermer', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.defileForm.invalid) return;

    this.loading = true;
    const defileData: Defile = {
      ...this.data,
      ...this.defileForm.value
    };

    const operation = this.isEditMode
      ? this.apiService.updateDefile(defileData)
      : this.apiService.createDefile(defileData);

    operation.subscribe({
      next: (createdDefile: Defile) => {
        if (!this.isEditMode) {
          this.createPlacesForDefile(createdDefile.id, createdDefile.nbPlacesTotal);
        }

        this.snackBar.open(
          `Défilé ${this.isEditMode ? 'modifié' : 'créé'} avec succès`,
          'Fermer',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error(`Erreur lors de ${this.isEditMode ? 'la modification' : 'la création'} du défilé`, error);
        this.snackBar.open(
          `Erreur lors de ${this.isEditMode ? 'la modification' : 'la création'} du défilé`,
          'Fermer',
          { duration: 3000 }
        );
        this.loading = false;
      }
    });
  }

  createPlacesForDefile(defileId: number, total: number): void {
    const places = Array.from({ length: total }).map((_, i) => ({
      defileId,
      numero: `A${i + 1}`,
      statut: 'disponible',
      reservationId: 0
    }));

    places.forEach(place => {
      this.apiService.createPlace(place).subscribe({
        next: () => {},
        error: err => console.error('Erreur création place', err)
      });
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
