import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css'
})
export class EmptyStateComponent {
  @Input() icon = 'search_off';
  @Input() title = 'Nothing here yet';
  @Input() subtitle?: string;
  @Input() actionLabel?: string;
  @Input() actionLink?: string;
}

