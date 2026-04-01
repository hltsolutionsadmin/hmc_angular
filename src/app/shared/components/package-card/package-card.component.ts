import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StorePackage } from '../../models/storefront';

@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrl: './package-card.component.css'
})
export class PackageCardComponent {
  @Input() pkg!: StorePackage;
  @Output() add = new EventEmitter<StorePackage>();

  onAdd(): void {
    this.add.emit(this.pkg);
  }

  priceToShow(): number {
    return this.pkg.discountPrice ?? this.pkg.price;
  }
}

