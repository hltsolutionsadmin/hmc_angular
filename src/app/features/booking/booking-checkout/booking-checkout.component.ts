import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingFlowStateService } from '../services/booking-flow-state.service';
import { BookingService } from '../../../shared/services/booking.service';
import { BookingFlowState } from '../models/booking-flow.model';
import { CartItem } from '../../../shared/models/storefront';

@Component({
  selector: 'app-booking-checkout',
  templateUrl: './booking-checkout.component.html',
  styleUrl: './booking-checkout.component.css',
})
export class BookingCheckoutComponent implements OnInit {
  form!: FormGroup;
  state!: BookingFlowState;
  submitting = false;
  errorMsg = '';
  collectionType: 'home' | 'lab' = 'home';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private flowState: BookingFlowStateService,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.state = this.flowState.snapshot();

    // Guard: no test or slot selected → back to tests
    if (!this.state.selectedTest || !this.state.selectedSlot) {
      this.router.navigate(['/layout/tests']);
      return;
    }

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      landmark: [''],
    });
  }

  get priceToShow(): number {
    const t = this.state.selectedTest!;
    return t.discountPrice ?? t.price;
  }

  setCollectionType(type: 'home' | 'lab'): void {
    this.collectionType = type;
  }

  onConfirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMsg = '';

    const { name, phone, address, landmark } = this.form.getRawValue();

    this.flowState.setPatientDetails({
      name,
      phone,
      address,
      landmark,
      collectionType: this.collectionType,
    });

    const cartItem: CartItem = {
      id: this.state.selectedTest!.id,
      kind: 'test',
      title: this.state.selectedTest!.name,
      price: this.state.selectedTest!.price,
      discountPrice: this.state.selectedTest!.discountPrice,
      meta: {
        reportTime: this.state.selectedTest!.reportTime,
        fastingRequired: this.state.selectedTest!.fastingRequired,
      },
    };

    try {
      const booking = this.bookingService.create({
        patientName: name,
        items: [cartItem],
        amountPaid: this.priceToShow,
      });

      this.flowState.setBookingId(booking.id);
      this.router.navigate(['/layout/booking/confirmation']);
    } catch {
      this.errorMsg = 'Something went wrong. Please try again.';
    } finally {
      this.submitting = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/layout/booking/slots', this.state.selectedTest?.id]);
  }
}
