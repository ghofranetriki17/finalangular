// src/app/admin/defiles/defiles-list/defiles-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Defile } from '../../../models/defile';
import { DefileFormComponent } from '../defile-form/defile-form.component';

@Component({
  selector: 'app-defiles-list',
  templateUrl: './defiles-list.component.html',
  styleUrls: ['./defiles-list.component.scss']
})
export class DefilesListComponent implements OnInit {
  defiles: Defile[] = [];
  loading = true;
  displayedColumns: string[] = ['nom', 'date', 'lieu', 'nbPlacesTotal', 'collection', 'actions'];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadDefiles();
  }

  loadDefiles(): void {
    this.loading = true;
    this.apiService.getDefiles().subscribe({
      next: (data) => {
        this.defiles = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des défilés', error);
        this.snackBar.open('Erreur lors du chargement des défilés', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openDefileForm(defile?: Defile): void {
    const dialogRef = this.dialog.open(DefileFormComponent, {
      width: '600px',
      data: defile ? { ...defile } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDefiles();
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}