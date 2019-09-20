import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalservingComponent } from './vitalserving.component';

describe('VitalservingComponent', () => {
  let component: VitalservingComponent;
  let fixture: ComponentFixture<VitalservingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalservingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalservingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
