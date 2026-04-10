import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SectionTitleComponent } from './components/section-title/section-title.component';
import { OfferCardComponent } from './components/offer-card/offer-card.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { StoreHeaderComponent } from './components/store-header/store-header.component';
import { StoreFooterComponent } from './components/store-footer/store-footer.component';

@NgModule({
  declarations: [
       SectionTitleComponent,
       OfferCardComponent,
       EmptyStateComponent,
       StoreHeaderComponent,
       StoreFooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [
    SectionTitleComponent,
    OfferCardComponent,
    EmptyStateComponent,
    StoreHeaderComponent,
    StoreFooterComponent,
  ]
})
export class SharedModule { }
