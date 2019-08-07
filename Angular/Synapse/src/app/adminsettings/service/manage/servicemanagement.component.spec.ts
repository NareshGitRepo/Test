import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicemanagementComponent } from './servicemanagement.component';

describe('ServicemanagementComponent', () => {
  let component: ServicemanagementComponent;
  let fixture: ComponentFixture<ServicemanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicemanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
