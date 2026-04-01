import { Injectable } from '@angular/core';
import { Address } from '../../../shared/models/storefront';

@Injectable({
  providedIn: 'root'
})
export class CheckoutStateService {
  patientName = '';
  patientAge?: number;
  patientGender: 'Male' | 'Female' | 'Other' = 'Male';
  notes = '';

  addresses: Address[] = [
    {
      id: 'A1',
      label: 'Home',
      name: 'John Doe',
      phone: '9999999999',
      line1: '12, MG Road',
      line2: 'Near Metro Station',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    {
      id: 'A2',
      label: 'Work',
      name: 'John Doe',
      phone: '9999999999',
      line1: '4th Floor, Orion Business Park',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560103'
    }
  ];

  selectedAddressId: string = this.addresses[0]?.id ?? '';

  get selectedAddress(): Address | undefined {
    return this.addresses.find((a) => a.id === this.selectedAddressId);
  }

  addAddress(address: Omit<Address, 'id'>): void {
    const id = `A${Date.now()}`;
    this.addresses = [{ id, ...address }, ...this.addresses];
    this.selectedAddressId = id;
  }
}

