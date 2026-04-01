 
import { Component, OnInit } from '@angular/core'; 
import { ApiCategory, ApiProduct } from '../../../../shared/models/catalog-api'; 
import { CatalogApiService } from '../../../../shared/services/catalog-api.service'; 
import { environment } from '../../../../../environment/environment';
 
@Component({ 
  selector: 'app-home-categories-section', 
  templateUrl: './categories-section.component.html', 
  styleUrl: './categories-section.component.css' 
}) 
export class CategoriesSectionComponent implements OnInit { 
  private readonly storeId = environment.storeId; 
 
  loadingCategories = false; 
  loadingProducts = false; 
  categories: ApiCategory[] = []; 
  products: ApiProduct[] = []; 
  selectedCategory?: ApiCategory; 
  errorMessage?: string;
 
  constructor(private catalogApi: CatalogApiService) {} 
 
  ngOnInit(): void { 
    this.fetchCategories(); 
  } 
 
  fetchCategories(): void { 
    this.loadingCategories = true; 
    this.errorMessage = undefined; 
    this.catalogApi 
      .getCategories({ storeId: this.storeId, page: 0, size: 200 }) 
      .subscribe(this.onCategoriesSuccess.bind(this), this.onCategoriesError.bind(this)); 
  } 
 
  private onCategoriesSuccess(res: any): void { 
    this.categories = res?.content ?? []; 
    this.loadingCategories = false; 
  } 
 
  private onCategoriesError(): void { 
    this.loadingCategories = false; 
    this.errorMessage = 'Failed to load categories'; 
  }
 
  onCategoryClick(category: ApiCategory): void { 
    this.selectedCategory = category; 
    this.fetchProducts(); 
  } 
 
  fetchProducts(): void { 
    this.loadingProducts = true; 
    this.errorMessage = undefined; 
    this.catalogApi 
      .searchProducts({ page: 0, size: 50 }) 
      .subscribe(this.onProductsSuccess.bind(this), this.onProductsError.bind(this)); 
  } 
 
  private onProductsSuccess(res: any): void { 
    this.products = res?.content ?? []; 
    this.loadingProducts = false; 
  } 
 
  private onProductsError(): void { 
    this.loadingProducts = false; 
    this.errorMessage = 'Failed to load products'; 
  }
 
  shortCategoryDescription(category: ApiCategory): string { 
    return this.truncateWords(category.description ?? '', 4); 
  } 
 
  truncateWords(text: string, wordsToKeep: number): string { 
    const words = text.trim().split(/\s+/).filter(Boolean); 
    if (words.length <= wordsToKeep) return text; 
    return words.slice(0, wordsToKeep).join(' ') + ' ....'; 
  } 
 
  productDescription(product: ApiProduct): string { 
    return (product.shortDescription ?? product.description ?? '').trim(); 
  } 
 
  productPrice(product: ApiProduct): number { 
    return product.price ? product.price.price : 0; 
  } 
 
  crossedPrice(product: ApiProduct): number { 
    return Math.round(this.productPrice(product) * 1.2); 
  } 
}
