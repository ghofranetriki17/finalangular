// src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
// Removed duplicate import of DesignersListComponent
// Removed duplicate import of DesignerFormComponent
/*import { CollectionsListComponent } from './collections/collections-list/collections-list.component';
import { CollectionFormComponent } from './collections/collection-form/collection-form.component';
import { DefilesListComponent } from './defiles/defiles-list/defiles-list.component';
import { DefileFormComponent } from './defiles/defile-form/defile-form.component';
import { FormationsListComponent } from './formations/formations-list/formations-list.component';
import { FormationFormComponent } from './formations/formation-form/formation-form.component';
import { DemandesStageListComponent } from './demandes-stage/demandes-stage-list/demandes-stage-list.component';
import { MaterielListComponent } from './materiel/materiel-list/materiel-list.component';
import { MaterielFormComponent } from './materiel/materiel-form/materiel-form.component';
import { ReservationsListComponent } from './reservations/reservations-list/reservations-list.component';*/

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
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { DesignersListComponent } from './designers/designers-list/designers-list.component';
import { DesignerFormComponent } from './designers/designer-form/designer-form.component';
import { StagiairesListComponent } from './stagiaires/stagiaires-list/stagiaires-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'collections', pathMatch: 'full' },
      { path: 'designers', component: DesignersListComponent },
      { path: 'stagiaires', component: StagiairesListComponent },
      { path: 'designers/add', component: DesignerFormComponent },
      /*{ path: 'designers/edit/:id', component: DesignerFormComponent },
      { path: 'collections', component: CollectionsListComponent },
      { path: 'collections/add', component: CollectionFormComponent },
      { path: 'collections/edit/:id', component: CollectionFormComponent },
      { path: 'defiles', component: DefilesListComponent },
      { path: 'defiles/add', component: DefileFormComponent },
      { path: 'defiles/edit/:id', component: DefileFormComponent },
      { path: 'formations', component: FormationsListComponent },
      { path: 'formations/add', component: FormationFormComponent },
      { path: 'formations/edit/:id', component: FormationFormComponent },
      { path: 'demandes-stage', component: DemandesStageListComponent },
      { path: 'materiel', component: MaterielListComponent },
      { path: 'materiel/add', component: MaterielFormComponent },
      { path: 'materiel/edit/:id', component: MaterielFormComponent },
      { path: 'reservations', component: ReservationsListComponent }*/
    ]
  }
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    DesignersListComponent,
    DesignerFormComponent,
    StagiairesListComponent,
    //DesignersListComponent,
    //DesignerFormComponent,
    //CollectionsListComponent,
    //CollectionFormComponent,
    //DefilesListComponent,
    //DefileFormComponent,
    //FormationsListComponent,
    //FormationFormComponent,
    //DemandesStageListComponent,
    //MaterielListComponent,
    //MaterielFormComponent,
    //ReservationsListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    
    // Material
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
    MatIconModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }