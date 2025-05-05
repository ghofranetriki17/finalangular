// src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DesignersListComponent } from './designers/designers-list/designers-list.component';
import { DesignerFormComponent } from './designers/designer-form/designer-form.component';
import { StagiairesListComponent } from './stagiaires/stagiaires-list/stagiaires-list.component';
import { StagiaireFormComponent } from './stagiaires/stagiaire-form/stagiaire-form.component';
import { DefilesListComponent } from './defiles/defiles-list/defiles-list.component';
import { DefileFormComponent } from './defiles/defile-form/defile-form.component';
import { ReservationsListComponent } from './defiles/reservations-list/reservations-list.component';
import { CollectionsListComponent } from './collections/collections-list/collections-list.component';
import { NgChartsModule } from 'ng2-charts';
import { Dashboard2Component } from './dashboard2/dashboard2.component';

// Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: 'defiles', component: DefilesListComponent },
      { path: 'defiles/add', component: DefileFormComponent },
      { path: '', redirectTo: 'collections', pathMatch: 'full' },
      { path: 'designers', component: DesignersListComponent },
      { path: 'stagiaires', component: StagiairesListComponent },
      { path: 'designers/add', component: DesignerFormComponent },
      { path: 'designers/edit/:id', component: DesignerFormComponent },
      { path: 'collections', component: CollectionsListComponent },
      { path: 'dashboard2', component: Dashboard2Component },
      { path: 'defiles/:id/reservations', component: ReservationsListComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    DesignersListComponent,
    DesignerFormComponent,
    StagiairesListComponent,
    StagiaireFormComponent,
    DefilesListComponent,
    DefileFormComponent,
    ReservationsListComponent,
    CollectionsListComponent,
    Dashboard2Component
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    NgChartsModule
  ]
})
export class AdminModule { }
