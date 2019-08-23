import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuageChartType2Component } from './guage-chart-type2.component';

describe('GuageChartType2Component', () => {
  let component: GuageChartType2Component;
  let fixture: ComponentFixture<GuageChartType2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuageChartType2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuageChartType2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
