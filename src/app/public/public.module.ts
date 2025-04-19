// src/app/public/public.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { HomeComponent } from './home/home.component';
import { CollectionsComponent } from './collections/collections.component';
import { DefilesComponent } from './defiles/defiles.component';
import { ReservationComponent } from './reservation/reservation.component';
import { DemandeStageComponent } from './demande-stage/demande-stage.component';

// Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon, MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'defiles', component: DefilesComponent },
  { path: 'reservation/:id', component: ReservationComponent },
  { path: 'demande-stage', component: DemandeStageComponent }
];

@NgModule({
  declarations: [
    HomeComponent,
    CollectionsComponent,
    DefilesComponent,
    ReservationComponent,
    DemandeStageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatDividerModule,
    MatExpansionModule,
    MatChipsModule,
    MatIconModule
  ]
})
export class PublicModule { }