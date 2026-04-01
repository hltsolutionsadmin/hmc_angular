import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';

const routes: Routes = [
  { path: '', component: OrdersListComponent },
  { path: 'details', component: OrderDetailsComponent },
  { path: 'track/:id', component: OrderTrackingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
