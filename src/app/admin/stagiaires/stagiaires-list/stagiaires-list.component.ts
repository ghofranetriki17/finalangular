import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Stagiaire } from '../../../models/stagiaire';
import { Designer } from '../../../models/designer';
import { ApiService } from '../../../core/services/api.service';
import { StagiaireFormComponent } from '../stagiaire-form/stagiaire-form.component';

@Component({
  selector: 'app-stagiaires-list',
  templateUrl: './stagiaires-list.component.html',
  styleUrls: ['./stagiaires-list.component.scss']
})
export class StagiairesListComponent implements OnInit {
  stagiaires: Stagiaire[] = [];
  designers: Designer[] = [];
  displayedColumns: string[] = ['id', 'nom', 'designer', 'niveau', 'dateDebut', 'dateFin', 'domaine', 'statut', 'actions'];
  loading = true;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadStagiaires();
    this.loadDesigners();
  }

  loadStagiaires(): void {
    this.loading = true;
    this.apiService.getStagiaires().subscribe({
      next: (data) => {
        this.stagiaires = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des stagiaires', error);
        this.snackBar.open('Erreur lors du chargement des stagiaires', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadDesigners(): void {
    this.apiService.getDesigners().subscribe({
      next: (data) => {
        this.designers = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des designers', error);
      }
    });
  }

  getDesignerName(designerId: number): string {
    const designer = this.designers.find(d => d.id === designerId);
    if (designer && designer.membre) {
      return `${designer.membre.prenom} ${designer.membre.nom}`;
    }
    return 'Designer inconnu';
  }

  openDialog(stagiaire?: Stagiaire): void {
    const dialogRef = this.dialog.open(StagiaireFormComponent, {
      width: '600px',
      data: { stagiaire: stagiaire || null, designers: this.designers }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStagiaires();
      }
    });
  }

  updateStatut(stagiaire: Stagiaire, statut: 'accepte' | 'refuse'): void {
    const updatedStagiaire = { ...stagiaire, statut };
    this.apiService.updateStagiaire(updatedStagiaire).subscribe({
      next: () => {
        this.snackBar.open(`Statut du stagiaire mis à jour avec succès`, 'Fermer', { duration: 3000 });
        this.loadStagiaires();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut', error);
        this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteStagiaire(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce stagiaire ?')) {
      this.apiService.deleteStagiaire(id).subscribe({
        next: () => {
          this.snackBar.open('Stagiaire supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadStagiaires();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du stagiaire', error);
          this.snackBar.open('Erreur lors de la suppression du stagiaire', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
