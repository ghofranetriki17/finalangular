// src/app/designer/designer-dashboard/designer-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { Collection } from '../../models/collection';
import { Designer } from '../../models/designer';
import { Membre } from '../../models/membre';

@Component({
  selector: 'app-designer-dashboard',
  templateUrl: './designer-dashboard.component.html',
  styleUrls: ['./designer-dashboard.component.scss']
})
export class DesignerDashboardComponent implements OnInit {
  designer: Designer | null = null;
  membre: Membre | null = null;
  collections: Collection[] = [];
  loading = true;
  error = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDesignerData();
  }

  loadDesignerData(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.authService.getUserByUid(user.uid).subscribe(membre => {
          if (membre) {
            this.membre = membre;
            this.authService.getDesignerByMembreId(membre.id).subscribe(designer => {
              if (designer) {
                this.designer = designer;
                this.loadCollections(designer.id);
              } else {
                this.error = true;
                this.loading = false;
              }
            });
          } else {
            this.error = true;
            this.loading = false;
          }
        });
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  loadCollections(designerId: number): void {
    this.apiService.getCollectionsByDesigner(designerId).subscribe({
      next: (data) => {
        this.collections = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des collections', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  navigateToCollectionsList(): void {
    this.router.navigate(['/designer/collections']);
  }

  navigateToNewCollection(): void {
    this.router.navigate(['/designer/collections/new']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
      }
    });
  }
}