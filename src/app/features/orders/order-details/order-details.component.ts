import { Component } from '@angular/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent { 
  order = {
    patientName: 'John Doe',
    testType: 'Comprehensive Blood Test',
    status: 'Pending',
    date: '20 Oct 2025',
    bookingId: '#123456789',
    doctor: 'Dr. Emily Carter',
    location: 'HMC Diagnostic Center, Downtown',
    contact: '+1 (555) 123-4567',
    notes: 'Fasting for 12 hours before the test. Bring previous reports if available.',
  };


}
