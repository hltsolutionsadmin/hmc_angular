import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartFacadeService } from '../service/cart-facade.service';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  coupon = '';
  cartId : string = "";

  private readonly cartFacade = inject(CartFacadeService);
  private readonly cartService = inject(CartService);

  readonly items$ = this.cartFacade.items$;
  readonly cartData$ = this.cartFacade.cartData$;
  readonly uniqueCount$ = this.cartFacade.totalUniqueItemsCount$;
  readonly grandTotal$ = this.cartFacade.grandTotal$;
  readonly subTotal$ = this.cartFacade.subTotal$;
  readonly totalDiscount$ = this.cartFacade.totalDiscount$;
  readonly totalTax$ = this.cartFacade.totalTax$;

  constructor(private router: Router) {
    this.cartFacade.loadCart();
    this.cartData$.subscribe(cart => {
      console.log('cart value', cart);
      this.cartId = cart?.id || "";
    })
  }

  proceed(): void {
    this.router.navigate(['/layout/checkout']);
  }
  
  removeFromCart(item: any): void {
    this.cartService.removeItemFromCart(this.cartId, item.id).subscribe({
      next:() => {
        this.cartFacade.loadCart();
        console.log("item deleted successfully",item)
      }
    })
  }
}

