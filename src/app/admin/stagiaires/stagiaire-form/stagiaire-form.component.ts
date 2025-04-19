// src/app/admin/stagiaires/stagiaire-form/stagiaire-form.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Stagiaire } from '../../../models/stagiaire';
import { Designer } from '../../../models/designer';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-stagiaire-form',
  templateUrl: './stagiaire-form.component.html',
  styleUrls: ['./stagiaire-form.component.scss']
})
export class StagiaireFormComponent implements OnInit {
  stagiaireForm!: FormGroup;
  isEdit = false;
  loading = false;
  niveaux = ['Débutant', 'Intermédiaire', 'Avancé'];
  statuts = ['en_attente', 'accepte', 'refuse'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<StagiaireFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stagiaire: Stagiaire, designers: Designer[] }
  ) { }

  ngOnInit(): void {
    this.isEdit = !!this.data.stagiaire;
    this.initForm();
  }

  initForm(): void {
    this.stagiaireForm = this.fb.group({
      id: [this.data.stagiaire?.id || 0],
      membreId: [this.data.stagiaire?.membreId || '', Validators.required],
      designerId: [this.data.stagiaire?.designerId || '', Validators.required],
      dateDebut: [this.data.stagiaire?.dateDebut || '', Validators.required],
      niveau: [this.data.stagiaire?.niveau || 'Débutant', Validators.required],
      statut: [this.data.stagiaire?.statut || 'en_attente', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.stagiaireForm.invalid) {
      return;
    }

    this.loading = true;
    const stagiaire: Stagiaire = this.stagiaireForm.value;

    if (this.isEdit) {
      this.apiService.updateStagiaire(stagiaire).subscribe({
        next: () => {
          this.snackBar.open('Stagiaire mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du stagiaire', error);
          this.snackBar.open('Erreur lors de la mise à jour du stagiaire', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.apiService.createStagiaire(stagiaire).subscribe({
        next: () => {
          this.snackBar.open('Stagiaire ajouté avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du stagiaire', error);
          this.snackBar.open('Erreur lors de l\'ajout du stagiaire', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}