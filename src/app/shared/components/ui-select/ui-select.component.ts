import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface UiSelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-ui-select',
  templateUrl: './ui-select.component.html',
  styleUrls: ['./ui-select.component.css']
})
export class UiSelectComponent {
  @Input() value: any = '';
  @Output() valueChange = new EventEmitter<any>();

  @Input() options: UiSelectOption[] = [];
  @Input() placeholder = 'Select';

  onChange(v: any): void {
    this.value = v;
    this.valueChange.emit(v);
  }
}
