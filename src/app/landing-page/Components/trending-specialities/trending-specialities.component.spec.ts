import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingSpecialitiesComponent } from './trending-specialities.component';

describe('TrendingSpecialitiesComponent', () => {
  let component: TrendingSpecialitiesComponent;
  let fixture: ComponentFixture<TrendingSpecialitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrendingSpecialitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingSpecialitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
