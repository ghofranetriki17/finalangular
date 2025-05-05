// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Dashboard2Component } from './admin/dashboard2/dashboard2.component';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./public/public.module').then(m => m.PublicModule)
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' }
  },
  { 
    path: 'designer', 
    loadChildren: () => import('./designer/designer.module').then(m => m.DesignerModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'designer' }
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }