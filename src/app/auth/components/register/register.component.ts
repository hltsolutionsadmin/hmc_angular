import { trigger, transition, style, animate } from '@angular/animations';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subject, takeUntil } from 'rxjs';
import { AuthServiceService } from '../../service/auth-service.service';

function matchFields(field: string, confirmField: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(field)?.value;
    const b = group.get(confirmField)?.value;
    if (!a || !b) return null;
    return a === b ? null : { fieldsMismatch: true };
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
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
    trigger('shake', [
      transition('* => shake', [
        animate('40ms', style({ transform: 'translateX(-5px)' })),
        animate('40ms', style({ transform: 'translateX(5px)' })),
        animate('40ms', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  step: 'details' | 'otp' | 'verified' = 'details';

  registerForm!: FormGroup;
  otpForm!: FormGroup;
  userId: string | null = null;

  hidePassword = true;
  hideConfirm = true;

  loadingRegister = false;
  loadingVerify = false;
  loadingResend = false;
  errorMessage = '';
  infoMessage = '';

  otpCooldownSeconds = 0;
  private destroy$ = new Subject<void>();
  private otpCooldownStop$ = new Subject<void>();

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(1)]],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: [matchFields('password', 'confirmPassword')] }
    );

    this.otpForm = this.fb.group({
      otpDigits: this.fb.array(
        Array.from({ length: 6 }, () =>
          this.fb.control('', [Validators.required, Validators.pattern(/^\d$/)])
        )
      )
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.otpCooldownStop$.next();
    this.otpCooldownStop$.complete();
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loadingRegister = true;
    this.errorMessage = '';
    this.infoMessage = '';

    const payload = {
      firstName: String(this.registerForm.value.firstName ?? '').trim(),
      lastName: String(this.registerForm.value.lastName ?? '').trim(),
      email: String(this.registerForm.value.email ?? '').trim(),
      mobile: String(this.registerForm.value.mobile ?? '').trim(),
      password: String(this.registerForm.value.password ?? '')
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.loadingRegister = false;
        this.userId = res.id;
        this.step = 'otp';
        this.infoMessage = `We sent a 6-digit OTP to ${res.email}.`;
        this.resetOtpInputs();
        this.focusOtp(0);
        this.startOtpCooldown(30);
      },
      error: (error) => {
        this.loadingRegister = false;
        this.errorMessage = error?.error?.message || 'Registration failed';
      }
    });
  }

  onVerifyOtp(): void {
    if (!this.userId) {
      this.errorMessage = 'Missing user id. Please register again.';
      this.step = 'details';
      return;
    }

    if (this.otpDigits.invalid) {
      this.otpDigits.markAllAsTouched();
      return;
    }

    this.loadingVerify = true;
    this.errorMessage = '';
    this.infoMessage = '';

    this.authService.verifyOtp({ userId: this.userId, otp: this.getOtpValue() }).subscribe({
      next: () => {
        this.loadingVerify = false;
        this.step = 'verified';
        this.infoMessage = 'Your email is verified. You can login now.';
      },
      error: (error) => {
        this.loadingVerify = false;
        this.errorMessage = error?.error?.message || 'Invalid OTP';
      }
    });
  }

  resendOtp(): void {
    if (!this.userId || this.loadingResend || this.otpCooldownSeconds > 0) return;

    this.loadingResend = true;
    this.errorMessage = '';
    this.infoMessage = '';

    this.authService.resendOtp({ userId: this.userId }).subscribe({
      next: () => {
        this.loadingResend = false;
        this.infoMessage = 'OTP resent successfully.';
        this.resetOtpInputs();
        this.focusOtp(0);
        this.startOtpCooldown(30);
      },
      error: (error) => {
        this.loadingResend = false;
        this.errorMessage = error?.error?.message || 'Failed to resend OTP';
      }
    });
  }

  goToLogin(): void {
    const email = String(this.registerForm.value.email ?? '').trim();
    this.router.navigate(['/login'], { queryParams: email ? { email } : undefined });
  }

  getInputState(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control) return 'border-slate-200 text-slate-500';
    if (control.invalid && (control.dirty || control.touched)) return 'border-rose-400 text-rose-500';
    if (control.valid) return 'border-emerald-400 text-emerald-600';
    return 'border-slate-200 text-slate-500';
  }

  shouldShakeControl(control: AbstractControl | null): string | null {
    if (control && control.invalid && control.touched) return 'shake';
    return null;
  }

  get otpDigits(): FormArray {
    return this.otpForm.get('otpDigits') as FormArray;
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digit = (input.value || '').replace(/\D/g, '').slice(-1);
    const control = this.otpDigits.at(index);
    control.setValue(digit);
    control.markAsTouched();

    if (digit) this.focusOtp(index + 1);
  }

  onOtpKeyDown(index: number, event: KeyboardEvent): void {
    const key = event.key;
    const control = this.otpDigits.at(index);

    if (key === 'Backspace') {
      const currentValue = String(control.value ?? '');
      if (!currentValue && index > 0) {
        const prevControl = this.otpDigits.at(index - 1);
        prevControl.setValue('');
        this.focusOtp(index - 1);
        event.preventDefault();
      }
      return;
    }

    if (key === 'ArrowLeft') {
      this.focusOtp(index - 1);
      event.preventDefault();
    }

    if (key === 'ArrowRight') {
      this.focusOtp(index + 1);
      event.preventDefault();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    const text = (event.clipboardData?.getData('text') ?? '').trim();
    const digits = text.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 0) return;

    digits.forEach((d, idx) => {
      if (idx < this.otpDigits.length) {
        const control = this.otpDigits.at(idx);
        control.setValue(d);
        control.markAsTouched();
      }
    });

    this.focusOtp(Math.min(digits.length, 5));
    event.preventDefault();
  }

  getOtpBoxState(index: number): string {
    const control = this.otpDigits.at(index);
    if (control.invalid && control.touched) return 'border-rose-400';
    if (String(control.value ?? '').length === 1) return 'border-emerald-400';
    return 'border-slate-200';
  }

  private focusOtp(index: number): void {
    if (!this.otpInputs) return;
    const inputs = this.otpInputs.toArray();
    if (index < 0 || index >= inputs.length) return;
    inputs[index].nativeElement.focus();
    inputs[index].nativeElement.select();
  }

  private startOtpCooldown(seconds: number): void {
    this.otpCooldownStop$.next();
    this.otpCooldownSeconds = seconds;

    interval(1000)
      .pipe(takeUntil(this.destroy$), takeUntil(this.otpCooldownStop$))
      .subscribe(() => {
        this.otpCooldownSeconds = Math.max(0, this.otpCooldownSeconds - 1);
        if (this.otpCooldownSeconds === 0) this.otpCooldownStop$.next();
      });
  }

  private resetOtpInputs(): void {
    this.otpDigits.controls.forEach((c) => c.setValue('', { emitEvent: false }));
    this.otpDigits.markAsUntouched();
    this.otpDigits.controls.forEach((c) => c.markAsUntouched());
  }

  private getOtpValue(): string {
    return this.otpDigits.controls.map((c) => String(c.value ?? '')).join('');
  }
}
