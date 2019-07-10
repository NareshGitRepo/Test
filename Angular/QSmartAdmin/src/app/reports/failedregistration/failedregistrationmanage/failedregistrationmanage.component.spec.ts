import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedregistrationmanageComponent } from './failedregistrationmanage.component';

describe('FailedregistrationmanageComponent', () => {
  let component: FailedregistrationmanageComponent;
  let fixture: ComponentFixture<FailedregistrationmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailedregistrationmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedregistrationmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
