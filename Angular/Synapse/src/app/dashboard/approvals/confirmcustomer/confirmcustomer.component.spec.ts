import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmcustomerComponent } from './confirmcustomer.component';

describe('ConfirmcustomerComponent', () => {
  let component: ConfirmcustomerComponent;
  let fixture: ComponentFixture<ConfirmcustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmcustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
