// src/app/designer/designer.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { DesignerDashboardComponent } from './designer-dashboard/designer-dashboard.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';

// Guards
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
  { 
    path: '', 
    component: DesignerDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'designer' }
  },
  { 
    path: 'collections', 
    component: CollectionListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'designer' }
  },
  { 
    path: 'collections/new', 
    component: CollectionFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'designer' }
  },
  { 
    path: 'collections/edit/:id', 
    component: CollectionFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'designer' }
  }
];

@NgModule({
  declarations: [
    DesignerDashboardComponent,
    CollectionListComponent,
    CollectionFormComponent
  ],
  imports: [
    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDividerModule,
    MatToolbarModule,
    MatTabsModule,
    MatTableModule,
MatPaginatorModule,
MatSortModule,
MatDialogModule,
MatSelectModule,
MatInputModule,
MatFormFieldModule
  ]
})
export class DesignerModule { }