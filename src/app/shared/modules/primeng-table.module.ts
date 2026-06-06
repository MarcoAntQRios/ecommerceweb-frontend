import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  exports: [
    TableModule,
    PaginatorModule,
    InputTextModule,
    InputNumberModule
  ]
})
export class PrimeNgTableModule { }