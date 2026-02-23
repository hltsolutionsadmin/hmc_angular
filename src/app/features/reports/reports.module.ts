import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ReportsListComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    MatIconModule
  ]
})
export class ReportsModule { }
