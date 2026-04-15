import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthServiceService } from '../../service/auth-service.service';
import { BookingFlowStateService } from '../../../features/booking/services/booking-flow-state.service';
import { TokenStorageService } from '../../service/token-storage.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [CommonModule, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        {
          provide: AuthServiceService,
          useValue: {
            sendOtp: () => of({}),
            loginWithOtp: () =>
              of({
                accessToken: 't',
                refreshToken: 'rt',
                expiresIn: 900,
                tokenType: 'Bearer'
              })
          }
        },
        { provide: TokenStorageService, useValue: { getDeviceId: () => 'device-1', setDeviceId: () => {} } },
        { provide: Router, useValue: { navigateByUrl: () => {} } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({}) } }
        },
        { provide: BookingFlowStateService, useValue: { restoreFromSession: () => {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
