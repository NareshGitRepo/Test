import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientjourneymanageComponent } from './patientjourneymanage.component';

describe('PatientjourneyComponent', () => {
  let component: PatientjourneymanageComponent;
  let fixture: ComponentFixture<PatientjourneymanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientjourneymanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientjourneymanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
