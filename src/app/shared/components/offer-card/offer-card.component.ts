import { Component, Input } from '@angular/core';
import { StoreOffer } from '../../models/storefront';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrl: './offer-card.component.css'
})
export class OfferCardComponent {
  @Input() offer!: StoreOffer;

  themeClass(): string {
    switch (this.offer.theme) {
      case 'green':
        return 'from-emerald-500 to-teal-500';
      case 'blue':
        return 'from-sky-500 to-indigo-500';
      case 'amber':
        return 'from-amber-500 to-orange-500';
      case 'violet':
        return 'from-violet-600 to-fuchsia-500';
      default:
        return 'from-indigo-600 to-sky-600';
    }
  }
}

