import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertdashboardComponent } from './alertdashboard.component';

describe('AlertdashboardComponent', () => {
  let component: AlertdashboardComponent;
  let fixture: ComponentFixture<AlertdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
