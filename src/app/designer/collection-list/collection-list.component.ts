// src/app/designer/collections/collection-list/collection-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { Collection } from 'src/app/models/collection';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss']
})
export class CollectionListComponent implements OnInit {
  collections: Collection[] = [];
  displayedColumns: string[] = ['nom', 'saison', 'type', 'dateCreation', 'actions'];
  loading = true;
  designerId: number | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user?.uid) {
        this.apiService.getMembres().subscribe(membres => {
          const designer = membres.find(m => m.uid === user.uid && m.role === 'designer');
          if (designer) {
            this.designerId = designer.id;
            this.loadCollections();
          } else {
            this.snackBar.open('Designer non trouvé.', 'Fermer', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  loadCollections(): void {
    if (!this.designerId) return;
    this.apiService.getCollectionsByDesigner(this.designerId).subscribe({
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