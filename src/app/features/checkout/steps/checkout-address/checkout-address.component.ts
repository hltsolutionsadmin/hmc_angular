import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, forkJoin, switchMap } from 'rxjs';
import { CheckoutStateService } from '../../services/checkout-state.service';
import { Address } from '../../../../shared/models/storefront';
import { UserAddressItem } from '../models/adress.model';
import { CityDto, CreateUserAddressRequest, StateDto } from '../models/location.model';
import { StepsService } from '../services/steps.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrl: './checkout-address.component.css'
})
export class CheckoutAddressComponent implements OnInit {
  adding = false;

  address: UserAddressItem[] = [];
  states: StateDto[] = [];
  cities: CityDto[] = [];

  loadingAddresses = false;
  loadingLocations = false;
  saving = false;

  form = {
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    stateId: '',
    cityId: '',
    postalCode: '',
    country: 'IN'
  };

  constructor(public state: CheckoutStateService, private router: Router, private stepsService: StepsService) {}

  ngOnInit(): void {
    this.refreshAddresses();
    this.loadLocations();
  }

  continue(): void {
    if (!this.state.selectedAddressId) return;
    this.router.navigate(['/layout/checkout/patient']);
  }

  toggleAdd(): void {
    this.adding = !this.adding;
  }

  onStateChange(): void {
    const selectedState = this.states.find((s) => s.id === this.form.stateId);
    if (!selectedState) {
      this.form.cityId = '';
      return;
    }

    const stillValid = this.cities.some((c) => c.id === this.form.cityId && c.stateCode === selectedState.code);
    if (!stillValid) this.form.cityId = '';
  }

  get filteredCities(): CityDto[] {
    const selectedState = this.states.find((s) => s.id === this.form.stateId);
    if (!selectedState) return this.cities;
    return this.cities.filter((c) => c.stateCode === selectedState.code);
  }

  save(): void {
    if (this.saving) return;
    if (
      !this.form.addressLine1 ||
      !this.form.stateId ||
      !this.form.cityId ||
      !this.form.postalCode
    )
      return;

    const selectedCity = this.cities.find((c) => c.id === this.form.cityId);
    const selectedState = this.states.find((s) => s.id === this.form.stateId);
    const fullText = this.buildFullText({
      addressLine1: this.form.addressLine1,
      addressLine2: this.form.addressLine2 || undefined,
      cityName: selectedCity?.name,
      stateName: selectedState?.name,
      postalCode: this.form.postalCode
    });

    const payload: CreateUserAddressRequest = {
      addressLine1: this.form.addressLine1,
      addressLine2: this.form.addressLine2 || undefined,
      stateId: this.form.stateId,
      cityId: this.form.cityId,
      postalCode: this.form.postalCode,
      country: this.form.country,
      fullText,
      firstName: this.form.firstName,
      lastName: this.form.lastName
    };

    this.saving = true;
    this.stepsService
      .createMyAddress(payload)
      .pipe(
        switchMap(() => this.stepsService.getMyAddresses(0, 10)),
        finalize(() => (this.saving = false))
      )
      .subscribe({
        next: (res) => {
          this.applyAddressResponse(res.content, fullText);
          this.adding = false;
          this.resetForm();
        }
      });
  }

  private refreshAddresses(): void {
    this.loadingAddresses = true;
    this.stepsService
      .getMyAddresses(0, 10)
      .pipe(finalize(() => (this.loadingAddresses = false)))
      .subscribe({
        next: (res) => {
          this.applyAddressResponse(res.content);
        }
      });
  }

  private loadLocations(): void {
    this.loadingLocations = true;
    forkJoin({
      states: this.stepsService.getStates(),
      cities: this.stepsService.getCities(0, 1000)
    })
      .pipe(finalize(() => (this.loadingLocations = false)))
      .subscribe({
        next: ({ states, cities }) => {
          this.states = (states ?? []).filter((s) => s.active);
          this.cities = (cities?.content ?? []).filter((c) => c.active);
          this.onStateChange();
        }
      });
  }

  private applyAddressResponse(items: UserAddressItem[], preferFullText?: string): void {
    this.address = items ?? [];
    const mapped = this.mapApiAddresses(items ?? []);
    this.state.addresses = mapped;

    if (!mapped.length) {
      this.state.selectedAddressId = '';
      return;
    }

    if (preferFullText) {
      const preferred = items.find((i) => i.address?.fullText === preferFullText)?.address?.id;
      if (preferred && mapped.some((a) => a.id === preferred)) {
        this.state.selectedAddressId = preferred;
        return;
      }
    }

    const current = this.state.selectedAddressId;
    this.state.selectedAddressId = current && mapped.some((a) => a.id === current) ? current : mapped[0].id;
  }

  private mapApiAddresses(items: UserAddressItem[]): Address[] {
    const mapped: Address[] = [];
    for (const item of items) {
      const id = item.address?.id;
      if (!id) continue;
      mapped.push({
        id,
        label: 'Home',
        name: item.userName ?? '',
        phone: '',
        line1: item.address.line1,
        line2: item.address.line2 ?? undefined,
        city: item.address.city,
        state: item.address.state,
        pincode: item.address.postalCode
      });
    }
    return mapped;
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

  private resetForm(): void {
    this.form = {
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      stateId: '',
      cityId: '',
      postalCode: '',
      country: 'IN'
    };
  }
}
