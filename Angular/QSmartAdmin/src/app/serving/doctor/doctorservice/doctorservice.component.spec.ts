import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorserviceComponent } from './doctorservice.component';

describe('DoctorserviceComponent', () => {
  let component: DoctorserviceComponent;
  let fixture: ComponentFixture<DoctorserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
