import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { Designer } from '../../models/designer';
import { DemandeStage } from '../../models/demande-stage';

@Component({
  selector: 'app-demande-stage',
  templateUrl: './demande-stage.component.html',
  styleUrls: ['./demande-stage.component.scss']
})
export class DemandeStageComponent implements OnInit {
  demandeForm!: FormGroup;
  designers: Designer[] = [];
  loading = true;
  submitting = false;
  error = false;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDesigners();
  }

  initForm(): void {
    this.demandeForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      designerId: ['', [Validators.required]],
      message: ['']
    });
  }

  loadDesigners(): void {
    this.apiService.getDesigners().subscribe({
      next: (designers) => {
        this.designers = designers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des designers:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.demandeForm.invalid) {
      return;
    }

    this.submitting = true;

    const demande: DemandeStage = {
      id: 0, // Sera généré par JSON Server
      nom: this.demandeForm.value.nom,
      prenom: this.demandeForm.value.prenom,
      email: this.demandeForm.value.email,
      telephone: this.demandeForm.value.telephone || undefined,
      designerId: this.demandeForm.value.designerId,
      message: this.demandeForm.value.message || undefined,
      dateCreation: new Date().toISOString(),
      statut: 'en_attente'
    };

    this.apiService.createDemandeStage(demande).subscribe({
      next: () => {
        this.snackBar.open('Demande de stage envoyée avec succès !', 'Fermer', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi de la demande de stage:', error);
        this.snackBar.open('Erreur lors de l\'envoi de la demande', 'Fermer', { duration: 3000 });
        this.submitting = false;
      }
    });
  }
}

