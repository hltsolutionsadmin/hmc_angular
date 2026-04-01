import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();

  @Input() placeholder = 'Search...';
  @Input() widthClass = 'w-64';

  onInput(v: string): void {
    this.value = v;
    this.valueChange.emit(v);
  }
}
