import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subject, takeUntil } from 'rxjs';
import { AuthServiceService } from '../../service/auth-service.service';
import { consumeReturnUrl } from '../../guards/auth.guard';
import { BookingFlowStateService } from '../../../features/booking/services/booking-flow-state.service';

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
    ]),
    trigger('shake', [
  transition('* => shake', [
    animate(
      '40ms',
      style({ transform: 'translateX(-5px)' })
    ),
    animate(
      '40ms',
      style({ transform: 'translateX(5px)' })
    ),
    animate(
      '40ms',
      style({ transform: 'translateX(0)' })
    )
  ])
])

  ]
})

export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  private destroy$ = new Subject<void>();
  loading = false;
  errorMessage = '';
  infoMessage = '';

  quotes: Quote[] = [
    { text: 'Your health, our priority.', author: 'Dr. A. Sharma' },
    { text: 'Compassionate care, every visit.', author: 'Nurse R. Patel' },
    { text: 'Healing starts with trust.', author: 'Dr. S. Mehta' },
    { text: 'Advanced care, personal touch.', author: 'Clinic Team' },
    { text: 'Together, we make wellness simple.', author: 'Patient Care Unit' }
  ];
  currentIdx = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private bookingFlowState: BookingFlowStateService,
  ) {}

  ngOnInit(): void {
    // Initialize reactive form
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      deviceId: ['693a0ebb-d0eb-43a3-bc84-78c3596bf57dfvd0', [Validators.required]]
    });

    const email = this.activatedRoute.snapshot.queryParamMap.get('email');
    if (email) {
      this.loginForm.patchValue({ username: email });
      this.infoMessage = 'Account verified. Please login.';
    }

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
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.infoMessage = '';

    this.authService.login(this.loginForm.getRawValue() as any).subscribe({
      next: () => {
        this.loading = false;
        // Restore any saved booking state and redirect to intended URL
        this.bookingFlowState.restoreFromSession();
        const returnUrl = consumeReturnUrl();
        this.router.navigateByUrl(returnUrl ?? '/layout/tests');
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.message || 'Login failed';
      }
    });
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

  shouldShakeControl(control: AbstractControl | null): string | null {
    if (control && control.invalid && control.touched) return 'shake';
    return null;
  }

}
