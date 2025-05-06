// src/app/admin/stagiaires/stagiaires-list/stagiaires-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Stagiaire } from '../../../models/stagiaire';
import { ApiService } from '../../../core/services/api.service';
import { StagiaireFormComponent } from '../stagiaire-form/stagiaire-form.component';

@Component({
  selector: 'app-stagiaires-list',
  templateUrl: './stagiaires-list.component.html',
  styleUrls: ['./stagiaires-list.component.scss']
})
export class StagiairesListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'designerTuteur', 'dateDebut', 'niveau', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Stagiaire>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadStagiaires();
  }

  loadStagiaires() {
    this.loading = true;
    this.apiService.getStagiaires().subscribe({
      next: (stagiaires) => {
        this.dataSource.data = stagiaires;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stagiaires:', error);
        this.snackBar.open('Erreur lors du chargement des stagiaires', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openStagiaireDialog(stagiaire?: Stagiaire) {
    const dialogRef = this.dialog.open(StagiaireFormComponent, {
      width: '600px',
      data: stagiaire
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStagiaires();
      }
    });
  }

  deleteStagiaire(stagiaire: Stagiaire) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le stagiaire ${stagiaire.membre?.nom} ${stagiaire.membre?.prenom} ?`)) {
      this.apiService.deleteStagiaire(stagiaire.id).subscribe({
        next: () => {
          this.loadStagiaires();
          this.snackBar.open('Stagiaire supprimé avec succès', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        },
        error: (error) => {
          console.error('Error deleting stagiaire:', error);
          this.snackBar.open('Erreur lors de la suppression du stagiaire', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'accepte':
        return 'accepte';
      case 'refuse':
        return 'refuse';
      default:
        return 'en_attente';
    }  
  }
}