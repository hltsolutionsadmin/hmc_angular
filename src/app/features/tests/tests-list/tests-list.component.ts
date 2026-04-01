import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreCategory, StoreTest } from '../../../shared/models/storefront';
import { SectionService } from '../../home/sections/section.service';
import { Observable } from 'rxjs';
import { CatalogApiService } from '../../../shared/services/catalog-api.service';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrl: './tests-list.component.css',
})
export class TestsListComponent implements OnInit {
  @Output() add = new EventEmitter<StoreTest>();
  @Output() view = new EventEmitter<StoreTest>();
  private readonly storeId = environment.storeId; 
  categories: StoreCategory[] = [];
  tests: StoreTest[] = [];
  search = '';
  selectedCategoryId = '';
  fastingOnly = false;
  errorMessage?: string;
   page = 0;
  size = 10;
  totalItems = 0;
  loading = false;
  sort: 'recommended' | 'price_low' | 'price_high' | 'rating' = 'recommended';
  private readonly productService = inject(SectionService);
  featured$!: Observable<StoreTest[]>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogApi: CatalogApiService
  ) {}

  ngOnInit(): void {
  this.fetchCategories();
  this.featured$ = this.productService.getFeaturedTests(this.page, this.size)
  this.route.queryParamMap.subscribe((params) => {
    this.search = params.get('q') ?? '';
    this.selectedCategoryId = params.get('cat') ?? '';
    this.page = Number(params.get('page') ?? 0);
    this.size = Number(params.get('size') ?? 12);
  });
}


  fetchCategories(): void { 
    this.catalogApi 
      .getCategories({ storeId: this.storeId, page: 0, size: 200 }) 
      .subscribe(this.onCategoriesSuccess.bind(this), this.onCategoriesError.bind(this)); 
  } 

  private onCategoriesSuccess(res: any): void { 
    this.categories = res?.content ?? []; 
    } 

    private onCategoriesError(): void { 
    this.errorMessage = 'Failed to load categories'; 
  }

  trackById(index: number, item: StoreTest): string {
    return item.id;
  }

  onCategoryChip(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { cat: categoryId || null },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(page: number): void {
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {
      page,
      size: this.size
    },
    queryParamsHandling: 'merge'
  });
}

onSizeChange(size: number): void {
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {
      page: 0,
      size
    },
    queryParamsHandling: 'merge'
  });
}

  // view(test: StoreTest): void {
  //   this.router.navigate(['/layout/tests/test', test.id]);
  // }
}
