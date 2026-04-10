import { Component } from '@angular/core';
import { CatalogService } from '../../../shared/services/catalog/catalog.service';
import { StoreOffer } from '../../../shared/models/storefront.model';

@Component({
  selector: 'app-offers-page',
  templateUrl: './offers-page.component.html',
  styleUrl: './offers-page.component.css'
})
export class OffersPageComponent {
  offers: StoreOffer[] = [];

  coupons = [
    { code: 'HEALTH10', desc: 'Extra 10% off on ₹1499+', tag: 'Best value' },
    { code: 'PACKAGE15', desc: '15% off on select packages', tag: 'Packages' },
    { code: 'SENIOR8', desc: '8% off for senior citizen care', tag: 'Senior' }
  ];

  constructor(private catalog: CatalogService) {
    this.offers = this.catalog.getOffers();
  }
}

