// src/app/admin/designers/designers-list/designers-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Designer } from '../../../models/designer';
import { Membre } from '../../../models/membre';

@Component({
  selector: 'app-designers-list',
  templateUrl: './designers-list.component.html',
  styleUrls: ['./designers-list.component.scss']
})
export class DesignersListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'specialite', 'anneesExperience', 'actions'];
  dataSource = new MatTableDataSource<Designer & Membre>();
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDesigners();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadDesigners(): void {
    this.http.get<Designer[]>(`${environment.apiUrl}/designers`).subscribe(
      designers => {
        if (!designers.length) {
          this.isLoading = false;
          return;
        }

        const requests = designers.map(designer =>
          this.http.get<Membre>(`${environment.apiUrl}/membres/${designer.membreId}`).toPromise()
            .then(membre => ({ ...designer, ...membre }))
            .catch(error => {
              console.error(`Erreur membre ${designer.membreId}:`, error);
              return null;
            })
        );

        Promise.all(requests).then(results => {
          this.dataSource.data = results.filter((r): r is Designer & Membre => r !== null);
          this.isLoading = false;
        });
      },
      error => {
        console.error('Erreur designers:', error);
        this.snackBar.open('Erreur chargement des designers', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  editDesigner(designer: Designer): void {
    this.router.navigate(['/admin/designers/edit', designer.id]);
  }

  deleteDesigner(designer: Designer): void {
    if (confirm(`Supprimer le designer ${designer.id} ?`)) {
      this.http.delete(`${environment.apiUrl}/designers/${designer.id}`).subscribe(
        () => {
          this.snackBar.open('Designer supprimé', 'Fermer', { duration: 3000 });
          this.loadDesigners();
        },
        error => {
          console.error('Erreur suppression:', error);
          this.snackBar.open('Erreur suppression designer', 'Fermer', { duration: 3000 });
        }
      );
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
