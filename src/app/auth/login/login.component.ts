import { trigger, transition, style, animate } from '@angular/animations';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subject, takeUntil } from 'rxjs';

interface Quote {
  text: string;
  author: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('pageFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('formSlide', [
      transition(':enter', [
        style({ transform: 'translateX(80px)', opacity: 0 }),
        animate('500ms 200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('quoteFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('800ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  hidePassword = true;
  private destroy$ = new Subject<void>();
  private route = inject(Router);

  quotes: Quote[] = [
    { text: 'Your health, our priority.', author: 'Dr. A. Sharma' },
    { text: 'Compassionate care, every visit.', author: 'Nurse R. Patel' },
    { text: 'Healing starts with trust.', author: 'Dr. S. Mehta' },
    { text: 'Advanced care, personal touch.', author: 'Clinic Team' },
    { text: 'Together, we make wellness simple.', author: 'Patient Care Unit' }
  ];
  currentIdx = 0;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize reactive form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Rotate quotes every 6s
    interval(6000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentIdx = (this.currentIdx + 1) % this.quotes.length;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login →', this.loginForm.value);
      this.route.navigate(['/layout/tests']);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  getYear(): number {
    return new Date().getFullYear();
  }

  // ✅ Utility: return class name based on control validity
  getInputState(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (!control) return 'border-gray-300 text-gray-500';

    if (control.invalid && (control.dirty || control.touched)) {
      return 'border-red-500 text-red-500';
    }
    if (control.valid) {
      return 'border-green-500 text-green-500';
    }
    return 'border-gray-300 text-gray-500';
  }
}
