import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-view-toggle',
  templateUrl: './view-toggle.component.html',
  styleUrls: ['./view-toggle.component.css']
})
export class ViewToggleComponent {
  @Input() mode: 'table' | 'card' = 'table';
  @Output() modeChange = new EventEmitter<'table' | 'card'>();

  @Input() disabled = false;

  setMode(mode: 'table' | 'card'): void {
    if (this.disabled) return;
    this.mode = mode;
    this.modeChange.emit(mode);
  }
}
