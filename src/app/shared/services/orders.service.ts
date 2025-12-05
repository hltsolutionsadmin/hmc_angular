import { Injectable } from '@angular/core';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private orders: Order[] = [
    { id: 1, patientName: 'John Doe', testType: 'Complete Blood Count', date: new Date().toISOString(), status: 'Pending' },
    { id: 2, patientName: 'Jane Smith', testType: 'Liver Function Test', date: new Date().toISOString(), status: 'Confirmed' },
  ];

  getAll(): Order[] { return [...this.orders]; }
  add(o: Omit<Order,'id'>) {
    const id = Math.max(0, ...this.orders.map(x => x.id)) + 1;
    this.orders.push({ id, ...o });
  }
  update(id: number, patch: Partial<Order>) {
    const idx = this.orders.findIndex(x => x.id === id);
    if (idx > -1) this.orders[idx] = { ...this.orders[idx], ...patch };
  }
  remove(id: number) { this.orders = this.orders.filter(x => x.id !== id); }
}
