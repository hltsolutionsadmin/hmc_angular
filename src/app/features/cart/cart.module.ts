import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { CartRoutingModule } from './cart-routing.module';
import { CartPageComponent } from './cart-page/cart-page.component';

@NgModule({
  declarations: [CartPageComponent],
  imports: [CommonModule, FormsModule, SharedModule, MatIconModule, CartRoutingModule]
})
export class CartModule {}

