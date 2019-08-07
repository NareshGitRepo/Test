import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirminterfaceComponent } from './confirminterface.component';

describe('ConfirminterfaceComponent', () => {
  let component: ConfirminterfaceComponent;
  let fixture: ComponentFixture<ConfirminterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirminterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirminterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
