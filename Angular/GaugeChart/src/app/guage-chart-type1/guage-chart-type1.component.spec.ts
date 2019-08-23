import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuageChartType1Component } from './guage-chart-type1.component';

describe('GuageChartType1Component', () => {
  let component: GuageChartType1Component;
  let fixture: ComponentFixture<GuageChartType1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuageChartType1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuageChartType1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
