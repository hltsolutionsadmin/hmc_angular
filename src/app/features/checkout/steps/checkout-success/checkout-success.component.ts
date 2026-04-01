import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../../shared/services/booking.service';
import { Booking } from '../../../../shared/models/storefront';

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css'
})
export class CheckoutSuccessComponent implements OnInit {
  id = '';
  booking?: Booking;

  constructor(private route: ActivatedRoute, private bookingSvc: BookingService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.booking = this.id ? this.bookingSvc.get(this.id) : undefined;
  }
}

