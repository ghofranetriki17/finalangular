import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Collection } from '../../models/collection';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements OnInit {
  collections: Collection[] = [];
  displayedColumns: string[] = ['nom', 'saison', 'type', 'dateCreation', 'actions'];
  loading = true;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.apiService.getCollectionsByDesigner(1).subscribe({ // Replace with actual designer ID
      next: (collections) => {
        this.collections = collections;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading collections', error);
        this.snackBar.open('Erreur lors du chargement des collections', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  editCollection(id: number): void {
    this.router.navigate(['/designer/collections/edit', id]);
  }

  deleteCollection(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer la suppression',
        message: 'Êtes-vous sûr de vouloir supprimer cette collection?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteCollection(id).subscribe({
          next: () => {
            this.snackBar.open('Collection supprimée avec succès', 'Fermer', { duration: 3000 });
            this.loadCollections();
          },
          error: (error) => {
            console.error('Error deleting collection', error);
            this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }
}