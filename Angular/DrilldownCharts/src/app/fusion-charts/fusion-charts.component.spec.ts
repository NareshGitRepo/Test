import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionChartsComponent } from './fusion-charts.component';

describe('FusionChartsComponent', () => {
  let component: FusionChartsComponent;
  let fixture: ComponentFixture<FusionChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FusionChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FusionChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
