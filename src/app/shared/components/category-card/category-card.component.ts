import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoreCategory } from '../../models/storefront';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {
  @Input() category!: StoreCategory;
  @Output() selected = new EventEmitter<StoreCategory>();

  onClick(): void {
    this.selected.emit(this.category);
  }
}

