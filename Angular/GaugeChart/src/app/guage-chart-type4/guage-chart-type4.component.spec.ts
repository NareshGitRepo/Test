import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuageChartType4Component } from './guage-chart-type4.component';

describe('GuageChartType4Component', () => {
  let component: GuageChartType4Component;
  let fixture: ComponentFixture<GuageChartType4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuageChartType4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuageChartType4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
