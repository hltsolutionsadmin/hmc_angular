import { AfterContentInit, Component, ContentChildren, Directive, EventEmitter, HostListener, Input, Output, QueryList, SimpleChanges, TemplateRef } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'status' | 'price';
  value?: (row: any) => any;
}

@Directive({
  selector: '[appTableCellDef]'
})
export class TableCellDefDirective {
  @Input('appTableCellDef') key!: string;

  constructor(public templateRef: TemplateRef<unknown>) {}
}

export interface TableAction {
  label: string;
  icon: string | ((row: any) => string);
  action: string;
  colorClass: string | ((row: any) => string);
  tooltip: string | ((row: any) => string);
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterContentInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() itemsPerPage: number = 10;
  @Input() clickableRows: boolean = true;

  @Input() statusClass?: (value: any, row?: any, col?: TableColumn) => string;
  @Input() statusLabel?: (value: any, row?: any, col?: TableColumn) => string;

  @Output() rowClicked = new EventEmitter<any>();
  @Output() actionClicked = new EventEmitter<{ action: string; row: any }>();

  @ContentChildren(TableCellDefDirective) cellDefs!: QueryList<TableCellDefDirective>;
  private cellDefMap = new Map<string, TemplateRef<unknown>>();

  currentPage: number = 1;
  isMobile: boolean = false;
  pagedItems: any[] = [];

  ngAfterContentInit(): void {
    this.rebuildCellDefMap();
    this.cellDefs.changes.subscribe(() => this.rebuildCellDefMap());
  }

  ngOnInit(): void {
    this.updateIsMobile();
    this.updatePagedItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.currentPage = 1;
      this.updatePagedItems();
    }
  }

  private rebuildCellDefMap(): void {
    this.cellDefMap.clear();
    if (!this.cellDefs) return;
    for (const def of this.cellDefs.toArray()) {
      if (def?.key) {
        this.cellDefMap.set(def.key, def.templateRef);
      }
    }
  }

  getCellTemplate(key: string): TemplateRef<unknown> | null {
    return this.cellDefMap.get(key) ?? null;
  }

  getCellValue(row: any, col: TableColumn): any {
    if (col.value) return col.value(row);
    return row?.[col.key];
  }

  @HostListener('window:resize')
  updateIsMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  get totalItems(): number {
    return this.data.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
  }

  updatePagedItems(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedItems = this.data.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedItems();
  }

  getPageNumbers(): (number | string)[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push('...');

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');

      pages.push(totalPages);
    }

    return pages;
  }

  onRowClick(row: any): void {
    if (this.clickableRows) {
      this.rowClicked.emit(row);
    }
  }

  onActionClick(event: Event, action: string, row: any): void {
    event.stopPropagation();
    this.actionClicked.emit({ action, row });
  }

  getActionIcon(btn: TableAction, row: any): string {
    return typeof btn.icon === 'function' ? btn.icon(row) : btn.icon;
  }

  getActionTooltip(btn: TableAction, row: any): string {
    return typeof btn.tooltip === 'function' ? btn.tooltip(row) : btn.tooltip;
  }

  getActionColorClass(btn: TableAction, row: any): string {
    return typeof btn.colorClass === 'function' ? btn.colorClass(row) : btn.colorClass;
  }

  getDefaultActionButtonClass(btn: TableAction): string {
    switch ((btn.action ?? '').toLowerCase()) {
      case 'delete':
        return 'border-red-200 text-red-600 hover:bg-red-50';
      case 'edit':
        return 'border-slate-200 text-slate-600 hover:bg-slate-50';
      default:
        return 'border-slate-200 text-slate-600 hover:bg-slate-50';
    }
  }

  getAlignmentClass(align: string = 'left'): string {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  }

  getStatusClass(value: any, row?: any, col?: TableColumn): string {
    if (this.statusClass) return this.statusClass(value, row, col);
    return value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getStatusLabel(value: any, row?: any, col?: TableColumn): string {
    if (this.statusLabel) return this.statusLabel(value, row, col);
    if (typeof value === 'boolean') return value ? 'Active' : 'Inactive';
    return `${value ?? ''}`;
  }
}
