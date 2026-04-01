import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCellDefDirective, TableComponent } from './components/table/table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { UiSelectComponent } from './components/ui-select/ui-select.component';
import { ViewToggleComponent } from './components/view-toggle/view-toggle.component';
import { UiButtonComponent } from './components/ui-button/ui-button.component';
import { RouterModule } from '@angular/router';
import { SectionTitleComponent } from './components/section-title/section-title.component';
import { BannerCarouselComponent } from './components/banner-carousel/banner-carousel.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { TestCardComponent } from './components/test-card/test-card.component';
import { PackageCardComponent } from './components/package-card/package-card.component';
import { OfferCardComponent } from './components/offer-card/offer-card.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { StoreHeaderComponent } from './components/store-header/store-header.component';
import { StoreFooterComponent } from './components/store-footer/store-footer.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
       TableComponent,
       TableCellDefDirective,
       PageHeaderComponent,
       SearchInputComponent,
       UiSelectComponent,
       ViewToggleComponent,
       UiButtonComponent,
       SectionTitleComponent,
       BannerCarouselComponent,
       CategoryCardComponent,
       TestCardComponent,
       PackageCardComponent,
       OfferCardComponent,
       EmptyStateComponent,
       StoreHeaderComponent,
       StoreFooterComponent,
       PaginationComponent,
       LoaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [
    TableComponent,
    TableCellDefDirective,
    PageHeaderComponent,
    SearchInputComponent,
    UiSelectComponent,
    ViewToggleComponent,
    UiButtonComponent,
    SectionTitleComponent,
    BannerCarouselComponent,
    CategoryCardComponent,
    TestCardComponent,
    PackageCardComponent,
    OfferCardComponent,
    EmptyStateComponent,
    StoreHeaderComponent,
    StoreFooterComponent,
    PaginationComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
