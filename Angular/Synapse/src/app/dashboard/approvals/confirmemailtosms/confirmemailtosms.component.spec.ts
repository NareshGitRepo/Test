import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmemailtosmsComponent } from './confirmemailtosms.component';

describe('ConfirmemailtosmsComponent', () => {
  let component: ConfirmemailtosmsComponent;
  let fixture: ComponentFixture<ConfirmemailtosmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmemailtosmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmemailtosmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
