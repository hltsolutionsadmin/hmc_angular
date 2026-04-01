import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() page = 0;
  @Input() size = 10;
  @Input() totalItems = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() maxVisiblePages = 5;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.size);
  }

    get minPage(): number {
    return Math.min((this.page + 1) * this.size, this.totalItems);
  }

  get pages(): number[] {
    const total = this.totalPages;
    if (total <= 0) return [];

    const half = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(0, this.page - half);
    let end = Math.min(total - 1, start + this.maxVisiblePages - 1);

    if (end - start + 1 < this.maxVisiblePages) {
      start = Math.max(0, end - this.maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get isFirstPage(): boolean {
    return this.page <= 0;
  }

  get isLastPage(): boolean {
    return this.page >= this.totalPages - 1;
  }

  goToPage(targetPage: number): void {
    if (
      targetPage < 0 ||
      targetPage >= this.totalPages ||
      targetPage === this.page
    ) {
      return;
    }

    this.pageChange.emit(targetPage);
  }

  goToPrevious(): void {
    if (!this.isFirstPage) {
      this.pageChange.emit(this.page - 1);
    }
  }

  goToNext(): void {
    if (!this.isLastPage) {
      this.pageChange.emit(this.page + 1);
    }
  }

  onPageSizeSelect(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (!value || value === this.size) {
      return;
    }

    this.sizeChange.emit(value);
  }

  trackByPage(_: number, page: number): number {
    return page;
  }
}
