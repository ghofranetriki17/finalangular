import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, finalize, forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { Designer } from '../../../models/designer';
import { Membre } from '../../../models/membre';
import { Stagiaire } from '../../../models/stagiaire';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-stagiaire-form',
  templateUrl: './stagiaire-form.component.html',
  styleUrls: ['./stagiaire-form.component.scss']
})
export class StagiaireFormComponent implements OnInit {
  stagiaireForm: FormGroup;
  designers: Designer[] = [];
  isEditMode = false;
  stagiaire: Stagiaire | null = null;
  membre: Membre | null = null;
  isSubmitted = false;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stagiaireForm = this.initForm();
  }

  ngOnInit(): void {
    this.loading = true;

    // Load designers for dropdown
    this.apiService.getDesigners().pipe(
      catchError(error => {
        this.error = "Erreur lors du chargement des designers. Veuillez réessayer.";
        return of([]);
      })
    ).subscribe(designers => {
      this.designers = designers;
      
      // Check if we're in edit mode
      const stagiaireId = this.route.snapshot.paramMap.get('id');
      if (stagiaireId) {
        this.isEditMode = true;
        this.loadStagiaire(Number(stagiaireId));
      } else {
        this.loading = false;
      }
    });
  }

  // Initialize form with default values
  private initForm(): FormGroup {
    return this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      designerId: [null, Validators.required],
      niveau: [null, Validators.required],
      dateDebut: ['', Validators.required],
      statut: ['en_attente', Validators.required]
    });
  }

  // Load stagiaire data for edit mode
  private loadStagiaire(id: number): void {
    this.apiService.getStagiaire(id).pipe(
      catchError(error => {
        this.error = "Erreur lors du chargement du stagiaire. Veuillez réessayer.";
        this.loading = false;
        return of(null);
      }),
      finalize(() => this.loading = false)
    ).subscribe(stagiaire => {
      if (stagiaire) {
        this.stagiaire = stagiaire;
        
        // If we have membre data attached to the stagiaire
        if (stagiaire.membre) {
          this.membre = stagiaire.membre;
          this.populateForm();
        } 
        // Else we need to fetch membre data separately - we'll simulate this since
        // there's no specific getMembre method in ApiService
        else {
          // Simulate membre data for demo purposes
          // In a real app, you would fetch this from API
          this.membre = {
            id: stagiaire.membreId,
            nom: '',
            prenom: '',
            email: '',
            role: 'stagiaire',
            dateInscription: new Date().toISOString()
          };
          this.populateForm();
        }
      }
    });
  }

  // Fill form with stagiaire data
  private populateForm(): void {
    if (this.stagiaire && this.membre) {
      this.stagiaireForm.patchValue({
        nom: this.membre.nom,
        prenom: this.membre.prenom,
        email: this.membre.email,
        telephone: this.membre.telephone || '',
        designerId: this.stagiaire.designerId,
        niveau: this.stagiaire.niveau,
        dateDebut: this.formatDateForInput(this.stagiaire.dateDebut),
        statut: this.stagiaire.statut
      });
    }
  }

  // Format date string for date input (YYYY-MM-DD)
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // Get form controls for easy access in template
  get f() {
    return this.stagiaireForm.controls;
  }

  // Submit form handler
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.stagiaireForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;

    const formData = this.stagiaireForm.value;

    if (this.isEditMode) {
      this.updateStagiaire(formData);
    } else {
      this.createStagiaire(formData);
    }
  }

  // Create new stagiaire
  private createStagiaire(formData: any): void {
    // In a real app, you would first create a membre then create a stagiaire
    // For demo purposes, we'll just create the stagiaire directly
    
    const stagiaire: Stagiaire = {
      id: 0, // Will be assigned by server
      membreId: 0, // This would normally come from a newly created membre
      designerId: Number(formData.designerId),
      dateDebut: formData.dateDebut,
      niveau: formData.niveau,
      statut: formData.statut,
      // Include membre info for display purposes
      membre: {
        id: 0,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone || undefined,
        role: 'stagiaire',
        dateInscription: new Date().toISOString()
      }
    };
    
    this.apiService.createStagiaire(stagiaire).pipe(
      catchError(error => {
        this.error = "Erreur lors de la création du stagiaire. Veuillez réessayer.";
        this.loading = false;
        return of(null);
      }),
      finalize(() => this.loading = false)
    ).subscribe(result => {
      if (result) {
        this.router.navigate(['/admin/stagiaires']);
      }
    });
  }

  // Update existing stagiaire
  private updateStagiaire(formData: any): void {
    if (!this.stagiaire) {
      this.error = "Données invalides pour la mise à jour";
      this.loading = false;
      return;
    }

    // Update stagiaire info
    const stagiaire: Stagiaire = {
      ...this.stagiaire,
      designerId: Number(formData.designerId),
      dateDebut: formData.dateDebut,
      niveau: formData.niveau,
      statut: formData.statut,
      // Update membre info too if API supports it
      membre: {
        id: this.stagiaire.membreId,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone || undefined,
        role: 'stagiaire',
        dateInscription: this.membre?.dateInscription || new Date().toISOString()
      }
    };

    this.apiService.updateStagiaire(stagiaire).pipe(
      catchError(error => {
        this.error = "Erreur lors de la mise à jour du stagiaire. Veuillez réessayer.";
        this.loading = false;
        return of(null);
      }),
      finalize(() => this.loading = false)
    ).subscribe(result => {
      if (result) {
        this.router.navigate(['/admin/stagiaires']);
      }
    });
  }
}