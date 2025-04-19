// src/app/core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requiredRole = route.data['role'] as 'admin' | 'designer' | 'stagiaire' | 'client';
    
    return this.authService.hasRole(requiredRole).pipe(
      tap(hasRole => {
        if (!hasRole) {
          console.log(`Accès refusé: Rôle "${requiredRole}" requis`);
          this.router.navigate(['/login']);
        }
      })
    );
  }
}