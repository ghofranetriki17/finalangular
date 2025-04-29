// src/app/admin/collections/collections-list/collections-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Collection } from '../../../models/collection';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-collections-list',
  templateUrl: './collections-list.component.html',
  styleUrls: ['./collections-list.component.scss']
})
export class CollectionsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nom', 'designer', 'saison', 'type', 'dateCreation', 'actions'];
  dataSource = new MatTableDataSource<Collection>();
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections() {
    this.loading = true;
    this.apiService.getCollections().subscribe({
      next: (collections) => {
        this.dataSource.data = collections;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading collections:', error);
        this.snackBar.open('Erreur lors du chargement des collections', 'Fermer', {
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

  editCollection(collection: Collection) {
    this.router.navigate(['/admin/collections/edit', collection.id]);
  }

  deleteCollection(collection: Collection) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: `Voulez-vous vraiment supprimer la collection "${collection.nom}" ?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteCollection(collection.id).subscribe({
          next: () => {
            this.loadCollections();
            this.snackBar.open('Collection supprimée avec succès', 'Fermer', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            console.error('Error deleting collection:', error);
            this.snackBar.open('Erreur lors de la suppression de la collection', 'Fermer', {
              duration: 3000,
              horizontalPosition: 'center', 
              verticalPosition: 'bottom'
            });
          }
        });
      }
    });
  }

  addCollection() {
    this.router.navigate(['/admin/collections/add']);
  }
}