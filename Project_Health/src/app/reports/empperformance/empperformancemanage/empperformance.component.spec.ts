import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpperformanceComponent } from './empperformance.component';

describe('EmpperformanceComponent', () => {
  let component: EmpperformanceComponent;
  let fixture: ComponentFixture<EmpperformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpperformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpperformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
