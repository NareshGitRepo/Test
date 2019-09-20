import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DDoctordashboardComponent } from './ddoctordashboard.component';

describe('DoctordashboardComponent', () => {
  let component: DDoctordashboardComponent;
  let fixture: ComponentFixture<DDoctordashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DDoctordashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DDoctordashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
