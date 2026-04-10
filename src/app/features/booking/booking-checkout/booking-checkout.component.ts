import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingFlowStateService } from '../services/booking-flow-state.service';
import { BookingFlowState } from '../models/booking-flow.model';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';
import { CartService } from '../../../shared/services/cart/cart.service';
import { CityDto, CreateUserAddressRequest, StateDto, UserAddressItem } from '../../../shared/models/address.model';
import { AddressService } from '../../../shared/services/address/address.service';
import { CheckoutOrderRequest, OrdersService } from '../../../shared/services/orders/orders.service';

@Component({
  selector: 'app-booking-checkout',
  templateUrl: './booking-checkout.component.html',
  styleUrl: './booking-checkout.component.css',
})
export class BookingCheckoutComponent implements OnInit {
  form!: FormGroup;
  addressForm!: FormGroup;
  state!: BookingFlowState;
  submitting = false;
  errorMsg = '';
  collectionType: 'home' | 'lab' = 'home';

  loadingAddresses = false;
  loadingLocations = false;
  savingAddress = false;

  addresses: UserAddressItem[] = [];
  states: StateDto[] = [];
  cities: CityDto[] = [];
  selectedAddressId = '';
  addingAddress = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private flowState: BookingFlowStateService,
    private steps: AddressService,
    private cartApi: CartService,
    private ordersApi: OrdersService,
  ) {}

  ngOnInit(): void {
    this.state = this.flowState.snapshot();

    // Guard: no test or slot selected → back to tests
    if (!this.state.selectedTest || !this.state.selectedSlot) {
      this.router.navigate(['/layout/tests']);
      return;
    }

    this.form = this.fb.group({
      landmark: [''],
    });

    this.addressForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      addressType: ['HOME', [Validators.required]],
      addressLine1: ['', [Validators.required, Validators.minLength(3)]],
      addressLine2: [''],
      stateId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
      country: ['IN', [Validators.required]]
    });

    this.refreshAddresses();
    this.loadLocations();
  }

  get priceToShow(): number {
    const t = this.state.selectedTest!;
    return t.discountPrice ?? t.price;
  }

  setCollectionType(type: 'home' | 'lab'): void {
    this.collectionType = type;
    this.errorMsg = '';
    if (type === 'home' && this.addresses.length === 0) this.addingAddress = true;
  }

  onConfirm(): void {
    this.submitting = true;
    this.errorMsg = '';

    let patientName = 'Lab Visit';
    let shippingAddressId: string | null = null;

    if (this.collectionType === 'home') {
      if (!this.selectedAddressId) {
        this.errorMsg = 'Please select or add an address for home collection.';
        this.submitting = false;
        return;
      }

      shippingAddressId = this.selectedAddressId;

      const { landmark } = this.form.getRawValue();
      const addressText = this.selectedAddress?.address.fullText ?? '';
      const name = String(this.selectedAddress?.address?.name ?? '').trim();
      const phone = String(this.selectedAddress?.address?.mobileNumber ?? '').trim();

      if (!name || !phone) {
        this.errorMsg = 'Please enter name and mobile number for home collection.';
        this.submitting = false;
        return;
      }

      patientName = name || 'Patient';

      this.flowState.setPatientDetails({
        name,
        phone,
        address: addressText,
        landmark,
        collectionType: 'home',
      });
    } else {
      // Lab visit: no address/patient entry required
      this.flowState.setPatientDetails({
        name: '',
        phone: '',
        address: '',
        collectionType: 'lab',
      });
    }

    this.cartApi.getActiveCart(environment.storeId).subscribe({
      next: (cart) => {
        const cartId = cart?.id;
        if (!cartId) {
          this.errorMsg = 'Unable to create/load cart. Please try again.';
          this.submitting = false;
          return;
        }

        const payload: CheckoutOrderRequest = {
          cartId,
          shippingAddressId,
          shippingMethod: 'STANDARD',
          paymentMethod: 'COD',
          paymentMethodId: null,
          couponCode: ''
        };

        this.ordersApi
          .checkout(payload)
          .pipe(finalize(() => (this.submitting = false)))
          .subscribe({
            next: (res) => {
              const orderId = this.extractOrderId(res) ?? cartId;
              this.flowState.setBookingId(orderId);
              this.router.navigate(['/layout/booking/confirmation']);
            },
            error: (error) => {
              this.errorMsg = error?.error?.message || 'Checkout failed. Please try again.';
            }
          });
      },
      error: (error) => {
        this.errorMsg = error?.error?.message || 'Unable to load cart. Please try again.';
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/layout/booking/slots', this.state.selectedTest?.id]);
  }

  toggleAddAddress(): void {
    this.addingAddress = !this.addingAddress;
  }

  onStateChange(): void {
    const selectedState = this.states.find((s) => s.id === this.addressForm.value.stateId);
    if (!selectedState) {
      this.addressForm.patchValue({ cityId: '' });
      return;
    }

    const stillValid = this.cities.some((c) => c.id === this.addressForm.value.cityId && c.stateCode === selectedState.code);
    if (!stillValid) this.addressForm.patchValue({ cityId: '' });
  }

  get filteredCities(): CityDto[] {
    const selectedState = this.states.find((s) => s.id === this.addressForm.value.stateId);
    if (!selectedState) return this.cities;
    return this.cities.filter((c) => c.stateCode === selectedState.code);
  }

  saveAddress(): void {
    if (this.savingAddress) return;
    if (this.collectionType !== 'home') return;

    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const name = String(this.addressForm.value.name ?? '').trim();
    const mobileNumber = String(this.addressForm.value.phone ?? '').trim();
    const addressType = String(this.addressForm.value.addressType ?? 'HOME').trim() as any;

    const stateId = String(this.addressForm.value.stateId ?? '');
    const cityId = String(this.addressForm.value.cityId ?? '');
    const line1 = String(this.addressForm.value.addressLine1 ?? '').trim();
    const line2 = String(this.addressForm.value.addressLine2 ?? '').trim();
    const postalCode = String(this.addressForm.value.postalCode ?? '').trim();
    const country = String(this.addressForm.value.country ?? 'IN').trim();

    const selectedCity = this.cities.find((c) => c.id === cityId);
    const selectedState = this.states.find((s) => s.id === stateId);
    const fullText = this.buildFullText({
      addressLine1: line1,
      addressLine2: line2 || undefined,
      cityName: selectedCity?.name,
      stateName: selectedState?.name,
      postalCode
    });

    const payload: CreateUserAddressRequest = {
      name,
      addressType,
      mobileNumber,
      addressLine1: line1,
      addressLine2: line2 || undefined,
      stateId,
      cityId,
      postalCode,
      country,
      fullText
    };

    this.savingAddress = true;
    this.steps
      .createMyAddress(payload)
      .pipe(finalize(() => (this.savingAddress = false)))
      .subscribe({
        next: () => {
          this.addingAddress = false;
          this.addressForm.reset({
            addressType: 'HOME',
            addressLine1: '',
            addressLine2: '',
            stateId: '',
            cityId: '',
            postalCode: '',
            country: 'IN'
          });
          this.refreshAddresses(fullText);
        },
        error: () => {
          this.errorMsg = 'Failed to save address. Please try again.';
        }
      });
  }

  private refreshAddresses(preferFullText?: string): void {
    this.loadingAddresses = true;
    this.steps
      .getMyAddresses(0, 100)
      .pipe(finalize(() => (this.loadingAddresses = false)))
      .subscribe({
        next: (res) => {
          this.addresses = res?.content ?? [];

          if (!this.addresses.length) {
            this.selectedAddressId = '';
            if (this.collectionType === 'home') this.addingAddress = true;
            return;
          }

          if (preferFullText) {
            const preferred = this.addresses.find((i) => i.address?.fullText === preferFullText)?.address?.id;
            if (preferred) {
              this.selectedAddressId = preferred;
              return;
            }
          }

          const current = this.selectedAddressId;
          const found = this.addresses.some((a) => a.address?.id === current);
          this.selectedAddressId = found ? current : (this.addresses[0]?.address?.id ?? '');
        },
        error: () => {
          this.addresses = [];
        }
      });
  }

  private loadLocations(): void {
    this.loadingLocations = true;
    forkJoin({
      states: this.steps.getStates(),
      cities: this.steps.getCities(0, 1000)
    })
      .pipe(finalize(() => (this.loadingLocations = false)))
      .subscribe({
        next: ({ states, cities }) => {
          this.states = (states ?? []).filter((s) => s.active);
          this.cities = (cities?.content ?? []).filter((c) => c.active);
          this.onStateChange();
        },
        error: () => {
          this.states = [];
          this.cities = [];
        }
      });
  }

  get selectedAddress(): UserAddressItem | undefined {
    return this.addresses.find((a) => a.address?.id === this.selectedAddressId);
  }

  private buildFullText(input: {
    addressLine1: string;
    addressLine2?: string;
    cityName?: string;
    stateName?: string;
    postalCode: string;
  }): string {
    const first = input.addressLine1.trim();
    const second = input.addressLine2?.trim();
    const city = input.cityName?.trim();
    const state = input.stateName?.trim();
    const pin = input.postalCode.trim();

    const addressPart = second ? `${first}, ${second}` : first;
    const regionPart = [city, state].filter(Boolean).join(', ');
    if (regionPart) return `${addressPart}, ${regionPart} ${pin}`.trim();
    return `${addressPart} ${pin}`.trim();
  }

  private extractOrderId(res: unknown): string | null {
    if (!res || typeof res !== 'object') return null;
    const r: any = res as any;
    const candidates: unknown[] = [
      r.id,
      r.orderId,
      r.orderNumber,
      r.bookingId,
      r.code,
      r.data?.id,
      r.data?.orderId,
      r.data?.orderNumber,
    ];
    for (const c of candidates) {
      if (typeof c === 'string' && c.trim()) return c.trim();
    }
    return null;
  }
}
