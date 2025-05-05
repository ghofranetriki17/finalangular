import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

import { ApiService } from '../../../core/services/api.service';
import { Designer } from '../../../models/designer';
import { Stagiaire } from '../../../models/stagiaire';
import { Membre } from '../../../models/membre';

@Component({
  selector: 'app-stagiaire-form',
  templateUrl: './stagiaire-form.component.html',
  styleUrls: ['./stagiaire-form.component.scss']
})
export class StagiaireFormComponent implements OnInit {
  stagiaireForm: FormGroup;
  designers: Designer[] = [];
  isEditMode = false;
  loading = false;
  isSubmitted = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private dialogRef: MatDialogRef<StagiaireFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Stagiaire
  ) {
    this.stagiaireForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      designerId: [null, Validators.required],
      dateDebut: ['', Validators.required],
      niveau: ['', Validators.required],
      statut: ['en_attente', Validators.required],
      domaine: [''],
      ecole: ['']
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.isEditMode = !!this.data;

    this.apiService.getDesigners().pipe(
      catchError(() => of([])),
      finalize(() => this.loading = false)
    ).subscribe(designers => {
      this.designers = designers;

      if (this.isEditMode && this.data) {
        this.loadFormWithData(this.data);
      }
    });
  }

  private loadFormWithData(stagiaire: Stagiaire): void {
    const membre = stagiaire.membre!;
    this.stagiaireForm.patchValue({
      nom: membre.nom,
      prenom: membre.prenom,
      email: membre.email,
      telephone: membre.telephone || '',
      designerId: stagiaire.designerId,
      dateDebut: stagiaire.dateDebut,
      niveau: stagiaire.niveau,
      statut: stagiaire.statut,
      domaine: (stagiaire as any).domaine || '',
      ecole: (stagiaire as any).ecole || ''
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.stagiaireForm.invalid) return;

    this.loading = true;
    const formData = this.stagiaireForm.value;

    // Ne pas inclure 'id' => il sera auto-généré
    const membre: Membre = {
      id: 0, // Default value, will be replaced by the server
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      role: 'stagiaire',
      dateInscription: new Date().toISOString()
    };
    

    if (this.isEditMode && this.data) {
      const stagiaire: Stagiaire = {
        ...this.data,
        designerId: formData.designerId,
        dateDebut: formData.dateDebut,
        niveau: formData.niveau,
        statut: formData.statut,
        membre: membre,
        ...(formData.domaine && { domaine: formData.domaine }),
        ...(formData.ecole && { ecole: formData.ecole })
      };

      this.apiService.updateStagiaire(stagiaire).pipe(
        catchError(() => {
          this.error = "Erreur lors de la mise à jour.";
          return of(null);
        }),
        finalize(() => this.loading = false)
      ).subscribe(result => {
        if (result) this.dialogRef.close(true);
      });

    } else {
      // Création membre -> puis stagiaire
      this.apiService.createMembre(membre).pipe(
        catchError(() => {
          this.error = "Erreur lors de la création du membre.";
          return of(null);
        }),
        switchMap((createdMembre: Membre | null) => {
          if (!createdMembre) return of(null);

          const newStagiaire: Stagiaire = {
            membreId: createdMembre.id,
            designerId: formData.designerId,
            dateDebut: formData.dateDebut,
            niveau: formData.niveau,
            statut: formData.statut,
            membre: createdMembre,
            ...(formData.domaine && { domaine: formData.domaine }),
            ...(formData.ecole && { ecole: formData.ecole })
          };

          return this.apiService.createStagiaire(newStagiaire);
        }),
        catchError(() => {
          this.error = "Erreur lors de la création du stagiaire.";
          return of(null);
        }),
        finalize(() => this.loading = false)
      ).subscribe(result => {
        if (result) this.dialogRef.close(true);
      });
    }
  }
}
