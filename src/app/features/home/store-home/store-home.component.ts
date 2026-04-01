import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreBanner, StoreCategory, StoreOffer, StorePackage, StoreTest } from '../../../shared/models/storefront';
import { CatalogService } from '../../../shared/services/catalog.service';
import { CartFacadeService } from '../../cart/service/cart-facade.service';

@Component({
  selector: 'app-store-home',
  templateUrl: './store-home.component.html',
  styleUrl: './store-home.component.css',
  animations: [
    trigger('reveal', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('380ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class StoreHomeComponent implements OnInit {
  banners: StoreBanner[] = [];
  categories: StoreCategory[] = [];
  featured: StoreTest[] = [];
  packages: StorePackage[] = [];
  offers: StoreOffer[] = [];

  testimonials = [
    { name: 'Ananya', text: 'Super smooth booking. Sample collection was on time and reports came next day.' },
    { name: 'Rohit', text: 'Loved the package suggestions. Clear fasting instructions and great discounts.' },
    { name: 'Meera', text: 'Very premium experience. Easy cart and checkout flow.' }
  ];

  constructor(private catalog: CatalogService, private cartFacade: CartFacadeService, private router: Router) {}

  ngOnInit(): void {
    this.banners = this.catalog.getBanners();
    // this.categories = this.catalog.getCategories();
    this.featured = this.catalog.getFeaturedTests();
    this.packages = this.catalog.getPopularPackages();
    this.offers = this.catalog.getOffers();
  }

  onCategorySelected(category: StoreCategory): void {
    this.router.navigate(['/layout/tests'], { queryParams: { cat: category.id } });
  }

  addTest(test: StoreTest): void {
    this.cartFacade.addToCart(test.id, 1);
  }

  addPackage(pkg: StorePackage): void {
    this.cartFacade.addToCart(pkg.id, 1);
  }

  viewTest(test: StoreTest): void {
    this.router.navigate(['/layout/tests/test', test.id]);
  }
}

