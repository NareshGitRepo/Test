import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SMStoEmailReportsComponent } from './smstoemailreports.component';

describe('EmailtosmsreportsComponent', () => {
  let component: SMStoEmailReportsComponent;
  let fixture: ComponentFixture<SMStoEmailReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SMStoEmailReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SMStoEmailReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
