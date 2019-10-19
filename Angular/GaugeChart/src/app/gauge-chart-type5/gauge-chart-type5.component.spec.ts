import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeChartType5Component } from './gauge-chart-type5.component';

describe('GaugeChartType5Component', () => {
  let component: GaugeChartType5Component;
  let fixture: ComponentFixture<GaugeChartType5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaugeChartType5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeChartType5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
