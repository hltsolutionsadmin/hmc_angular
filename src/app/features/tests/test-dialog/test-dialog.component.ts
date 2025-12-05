import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Test } from '../../../shared/models/test';

@Component({
  selector: 'app-test-dialog',
  templateUrl: './test-dialog.component.html',
  styleUrl: './test-dialog.component.css'
})
export class TestDialogComponent {
  mode: 'add' | 'edit' = 'add';
  model: Omit<Test, 'id'> = { name: '', category: '', enabled: true, subTests: [] };

  constructor(
    private ref: MatDialogRef<TestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit'; test?: Test }
  ) {
    this.mode = data?.mode ?? 'add';
    if (data?.test) {
      const { id, ...rest } = data.test;
      this.model = { ...rest };
    }
  }

  
  get subTestsCSV(): string { return (this.model.subTests || []).join(', '); }
  // set subTestsCSV(v: string) { this.model.subTests = v.split(',').map(s => s.trim()).filter(Boolean); }

  save() { this.ref.close(this.model); }
  close() { this.ref.close(); }
}
