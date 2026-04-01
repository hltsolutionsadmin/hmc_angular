import { Component, Input, OnInit } from '@angular/core';
import { StoreOffer } from '../../../../shared/models/storefront';
import { CatalogService } from '../../../../shared/services/catalog.service';

@Component({
  selector: 'app-home-offers-section',
  templateUrl: './offers-section.component.html',
  styleUrl: './offers-section.component.css'
})
export class OffersSectionComponent implements OnInit {
  @Input() offers: StoreOffer[] = [];

  constructor(private catalog: CatalogService) {}

  ngOnInit(): void {
    this.offers = this.catalog.getOffers();
  }
}

