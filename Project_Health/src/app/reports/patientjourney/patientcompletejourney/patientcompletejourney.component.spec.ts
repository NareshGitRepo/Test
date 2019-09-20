import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientcompletejourneyComponent } from './patientcompletejourney.component';

describe('PatientcompletejourneyComponent', () => {
  let component: PatientcompletejourneyComponent;
  let fixture: ComponentFixture<PatientcompletejourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientcompletejourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientcompletejourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
