import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  isCatalogOpen = true;
  isInventoryOpen = false;
  isMarketingOpen = false;

  constructor(private router: Router) {}

  toggleCatalog(): void {
    this.isCatalogOpen = !this.isCatalogOpen;
  }

  toggleInventory(): void {
    this.isInventoryOpen = !this.isInventoryOpen;
  }

  toggleMarketing(): void {
    this.isMarketingOpen = !this.isMarketingOpen;
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}
