import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from '../../../shared/services/orders.service';
import { Order } from '../../../shared/models/order';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css'
})
export class OrdersListComponent {
  displayedColumns = ['patientName','testType','date','status','actions'];
  data: Order[] = [];
  constructor(private svc: OrdersService, private dialog: MatDialog) {
    this.refresh();
  }

  refresh() { this.data = this.svc.getAll(); }

  add() {
    const ref = this.dialog.open(OrderDialogComponent, { width: '560px' });
    ref.afterClosed().subscribe(res => { if (res) { this.svc.add(res); this.refresh(); } });
  }

  edit(row: Order) {
    const ref = this.dialog.open(OrderDialogComponent, { width: '560px', data: row });
    ref.afterClosed().subscribe(res => { if (res) { this.svc.update(row.id, res); this.refresh(); } });
  }

  remove(row: Order) { this.svc.remove(row.id); this.refresh(); }
}
