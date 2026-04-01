import { Component } from '@angular/core';

@Component({
  selector: 'app-store-footer',
  templateUrl: './store-footer.component.html',
  styleUrl: './store-footer.component.css'
})
export class StoreFooterComponent {
  year = new Date().getFullYear();
}

