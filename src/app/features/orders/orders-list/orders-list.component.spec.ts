import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OrdersListComponent } from './orders-list.component';
import { OrdersService } from '../../../shared/services/orders.service';

describe('OrdersListComponent', () => {
  let component: OrdersListComponent;
  let fixture: ComponentFixture<OrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersListComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            getMyOrders: () =>
              of({
                content: [],
                totalElements: 0,
                totalPages: 0,
                number: 0,
                size: 20,
                first: true,
                last: true,
                numberOfElements: 0,
                empty: true
              })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
