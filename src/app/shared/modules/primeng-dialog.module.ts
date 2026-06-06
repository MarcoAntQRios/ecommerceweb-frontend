import { NgModule } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  exports: [
    DialogModule,
    ConfirmDialogModule
  ]
})
export class PrimeNgDialogModule { }