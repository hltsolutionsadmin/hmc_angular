import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.css']
})
export class UiButtonComponent {
  @Input() label = '';
  @Input() icon?: string;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Input() disabled = false;

  get className(): string {
    switch (this.variant) {
      case 'secondary':
        return 'ui-btn ui-btn--secondary';
      case 'ghost':
        return 'ui-btn ui-btn--ghost';
      default:
        return 'ui-btn ui-btn--primary';
    }
  }
}
