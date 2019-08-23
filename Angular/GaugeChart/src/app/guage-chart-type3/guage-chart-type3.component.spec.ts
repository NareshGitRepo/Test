import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuageChartType3Component } from './guage-chart-type3.component';

describe('GuageChartType3Component', () => {
  let component: GuageChartType3Component;
  let fixture: ComponentFixture<GuageChartType3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuageChartType3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuageChartType3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
