import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareSectionComponent } from './healthcare-section.component';

describe('HealthcareSectionComponent', () => {
  let component: HealthcareSectionComponent;
  let fixture: ComponentFixture<HealthcareSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HealthcareSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthcareSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
