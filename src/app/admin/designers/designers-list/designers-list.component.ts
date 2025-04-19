// src/app/admin/designers/designers-list/designers-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
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
export class DesignersListComponent implements OnInit {
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
      (designers) => {
        const designersWithDetails: Array<Designer & Membre> = [];
        
        // Récupérer les détails des membres pour chaque designer
        let completedRequests = 0;
        
        designers.forEach(designer => {
          this.http.get<Membre>(`${environment.apiUrl}/membres/${designer.membreId}`).subscribe(
            (membre) => {
              designersWithDetails.push({...designer, ...membre});
              completedRequests++;
              
              if (completedRequests === designers.length) {
                this.dataSource.data = designersWithDetails;
                this.isLoading = false;
              }
            },
            (error) => {
              console.error(`Erreur lors de la récupération du membre ${designer.membreId}:`, error);
              completedRequests++;
              
              if (completedRequests === designers.length) {
                this.dataSource.data = designersWithDetails;
                this.isLoading = false;
              }
            }
          );
        });
        
        if (designers.length === 0) {
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des designers:', error);
        this.snackBar.open('Erreur lors du chargement des designers', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  editDesigner(designer: Designer): void {
    this.router.navigate(['/admin/designers/edit', designer.id]);
  }

  deleteDesigner(designer: Designer): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le designer ${designer.id} ?`)) {
      this.http.delete(`${environment.apiUrl}/designers/${designer.id}`).subscribe(
        () => {
          this.snackBar.open('Designer supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadDesigners();
        },
        (error) => {
          console.error('Erreur lors de la suppression du designer:', error);
          this.snackBar.open('Erreur lors de la suppression du designer', 'Fermer', { duration: 3000 });
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