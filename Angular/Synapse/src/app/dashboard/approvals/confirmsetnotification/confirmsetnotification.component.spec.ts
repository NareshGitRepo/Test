import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmsetnotificationComponent } from './confirmsetnotification.component';

describe('ConfirmsetnotificationComponent', () => {
  let component: ConfirmsetnotificationComponent;
  let fixture: ComponentFixture<ConfirmsetnotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmsetnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmsetnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
