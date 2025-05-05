// src/app/admin/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  navLinks = [
    { path: 'collections', label: 'Collections' },
    { path: 'designers', label: 'Designers' },
    { path: 'stagiaires', label: 'stagiaires' },
    { path: 'defiles', label: 'Défilés' },
    { path: 'formations', label: 'Formations' },
    { path: 'demandes-stage', label: 'Demandes de stage' },
    { path: 'materiel', label: 'Matériel' },
    { path: 'reservations', label: 'Réservations' },
    { path: 'dashboard2', label: 'Dashboard' }

  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/auth/login']);
    });
  }
}