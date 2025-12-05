import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Order } from '../../../shared/models/order';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrl: './order-dialog.component.css'
})
export class OrderDialogComponent {
  model: Omit<Order,'id'> = { patientName: '', testType: '', date: new Date().toISOString(), status: 'Pending' };
  statuses: Order['status'][] = ['Pending','Confirmed','Completed'];

  constructor(
    private ref: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Order
  ) {
    if (data) {
      const { id, ...rest } = data;
      this.model = { ...rest };
    }
  }

  save() { this.ref.close(this.model); }
  close() { this.ref.close(); }
}
