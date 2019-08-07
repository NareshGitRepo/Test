import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticdashboardComponent } from './staticdashboard.component';

describe('StaticdashboardComponent', () => {
  let component: StaticdashboardComponent;
  let fixture: ComponentFixture<StaticdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
