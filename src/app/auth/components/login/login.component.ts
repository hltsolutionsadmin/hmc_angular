import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subject, takeUntil } from 'rxjs';
import { AuthServiceService } from '../../service/auth-service.service';
import { consumeReturnUrl } from '../../guards/auth.guard';
import { BookingFlowStateService } from '../../../features/booking/services/booking-flow-state.service';
import { TokenStorageService } from '../../service/token-storage.service';

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
  sendingOtp = false;
  mobileLocked = false;
  errorMessage = '';
  infoMessage = '';
  readonly otpLength = 6;

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
    private tokenStorage: TokenStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private bookingFlowState: BookingFlowStateService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      primaryContact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      otp: this.fb.array(this.buildOtpControls()),
      deviceId: [this.getOrCreateDeviceId(), [Validators.required]]
    });

    const reason = this.activatedRoute.snapshot.queryParamMap.get('reason');
    if (reason === 'session_expired') {
      this.errorMessage = 'Session expired. Please login again.';
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

    const primaryContact = String(this.loginForm.get('primaryContact')?.value ?? '');
    const otp = this.getOtpValue();
    const deviceId = String(this.loginForm.get('deviceId')?.value ?? '');

    this.authService.loginWithOtp({ primaryContact, otp, deviceId }).subscribe({
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

  getOtpInputState(index: number): string {
    const control = this.otpArray.at(index);
    if (!control) return 'border-gray-300';

    if (control.invalid && (control.dirty || control.touched)) return 'border-red-500';
    if (control.valid) return 'border-green-500';
    return 'border-gray-300';
  }

  shouldShakeControl(control: AbstractControl | null): string | null {
    if (control && control.invalid && control.touched) return 'shake';
    return null;
  }

  onMobileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const prev = String(this.loginForm.get('primaryContact')?.value ?? '');
    const normalized = (input.value ?? '').replace(/\D/g, '').slice(0, 10);
    if (normalized !== input.value) input.value = normalized;
    this.loginForm.get('primaryContact')?.setValue(normalized);

    if (!this.mobileLocked && prev !== normalized) {
      this.clearOtp();
    }
  }

  onSendOtpOrEdit(): void {
    if (this.mobileLocked) {
      this.mobileLocked = false;
      this.infoMessage = '';
      this.errorMessage = '';
      this.clearOtp();
      return;
    }

    const mobileControl = this.loginForm.get('primaryContact');
    if (!mobileControl) return;

    mobileControl.markAsTouched();
    if (mobileControl.invalid) return;

    this.sendingOtp = true;
    this.mobileLocked = true;
    this.infoMessage = '';
    this.errorMessage = '';

    const primaryContact = String(mobileControl.value ?? '');
    this.authService.sendOtp({ primaryContact }).subscribe({
      next: () => {
        this.sendingOtp = false;
        this.infoMessage = 'OTP sent to your mobile number.';
        setTimeout(() => this.focusOtp(0), 0);
      },
      error: (error) => {
        this.sendingOtp = false;
        this.mobileLocked = false;
        this.errorMessage = error?.error?.message || 'Failed to send OTP';
      }
    });
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digit = (input.value ?? '').replace(/\D/g, '').slice(-1);

    this.otpArray.at(index)?.setValue(digit);
    input.value = digit;

    if (digit && index < this.otpLength - 1) {
      this.focusOtp(index + 1);
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      this.focusOtp(index - 1);
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusOtp(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < this.otpLength - 1) {
      event.preventDefault();
      this.focusOtp(index + 1);
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text') ?? '';
    const digits = pasted.replace(/\D/g, '').slice(0, this.otpLength);
    if (!digits) return;

    event.preventDefault();
    digits.split('').forEach((d, i) => this.otpArray.at(i)?.setValue(d));
    this.focusOtp(Math.min(digits.length, this.otpLength - 1));
  }

  get otpArray(): FormArray {
    return this.loginForm.get('otp') as FormArray;
  }

  private focusOtp(index: number): void {
    const el = document.getElementById(`otp-${index}`) as HTMLInputElement | null;
    el?.focus();
    el?.select();
  }

  private buildOtpControls(): FormControl[] {
    return Array.from({ length: this.otpLength }, () =>
      this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)])
    ) as FormControl[];
  }

  private getOtpValue(): string {
    return this.otpArray.controls.map((c) => String(c.value ?? '')).join('');
  }

  private clearOtp(): void {
    this.otpArray.controls.forEach((c) => c.setValue(''));
    this.otpArray.markAsPristine();
    this.otpArray.markAsUntouched();
  }

  private getOrCreateDeviceId(): string {
    const existing = this.tokenStorage.getDeviceId();
    if (existing) return existing;

    const created =
      (globalThis as any)?.crypto?.randomUUID?.() ?? `device-${Math.random().toString(16).slice(2)}-${Date.now()}`;

    this.tokenStorage.setDeviceId(created);
    return created;
  }

}
