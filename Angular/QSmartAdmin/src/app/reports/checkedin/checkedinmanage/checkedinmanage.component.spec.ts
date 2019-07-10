import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckedinmanageComponent } from './checkedinmanage.component';

describe('CheckedinmanageComponent', () => {
  let component: CheckedinmanageComponent;
  let fixture: ComponentFixture<CheckedinmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckedinmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckedinmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
