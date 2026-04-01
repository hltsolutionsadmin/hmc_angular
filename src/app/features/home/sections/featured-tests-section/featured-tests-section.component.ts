import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { StoreTest } from '../../../../shared/models/storefront';
import { CatalogService } from '../../../../shared/services/catalog.service';
import { SectionService } from '../section.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-featured-tests-section',
  templateUrl: './featured-tests-section.component.html',
  styleUrl: './featured-tests-section.component.css'
})
export class FeaturedTestsSectionComponent implements OnInit {
  @Output() add = new EventEmitter<StoreTest>();
  @Output() view = new EventEmitter<StoreTest>();

  private readonly productService = inject(SectionService);

  featured$!: Observable<StoreTest[]>;

  ngOnInit(): void {
    this.featured$ = this.productService.getFeaturedTests(0, 6);
  }

  trackById(index: number, item: StoreTest): string {
  return item.id;
}
}

