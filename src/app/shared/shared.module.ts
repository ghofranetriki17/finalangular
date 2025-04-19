import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';



@NgModule({
  declarations: [
    NavigationComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
