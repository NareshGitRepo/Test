import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrilldowndashboardComponent } from './drilldowndashboard.component';

describe('DrilldowndashboardComponent', () => {
  let component: DrilldowndashboardComponent;
  let fixture: ComponentFixture<DrilldowndashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrilldowndashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrilldowndashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
