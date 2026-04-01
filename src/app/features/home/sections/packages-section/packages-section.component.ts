import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { StorePackage } from '../../../../shared/models/storefront';
import { CatalogService } from '../../../../shared/services/catalog.service';

@Component({
  selector: 'app-home-packages-section',
  templateUrl: './packages-section.component.html',
  styleUrl: './packages-section.component.css'
})
export class PackagesSectionComponent implements OnInit{
  @Input() packages: StorePackage[] = [];
  @Output() add = new EventEmitter<StorePackage>();

  catalog = inject(CatalogService);

  ngOnInit(): void {
    this.packages = this.catalog.getPopularPackages();
  }
}

