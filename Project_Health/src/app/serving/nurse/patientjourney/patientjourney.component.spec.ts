import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientjourneyComponent } from './patientjourney.component';

describe('PatientjourneyComponent', () => {
  let component: PatientjourneyComponent;
  let fixture: ComponentFixture<PatientjourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientjourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientjourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
