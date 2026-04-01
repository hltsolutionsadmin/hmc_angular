import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { OffersRoutingModule } from './offers-routing.module';
import { OffersPageComponent } from './offers-page/offers-page.component';

@NgModule({
  declarations: [OffersPageComponent],
  imports: [CommonModule, SharedModule, MatIconModule, OffersRoutingModule]
})
export class OffersModule {}

