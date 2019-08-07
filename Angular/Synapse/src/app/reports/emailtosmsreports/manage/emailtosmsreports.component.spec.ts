import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailtosmsreportsComponent } from './emailtosmsreports.component';

describe('EmailtosmsreportsComponent', () => {
  let component: EmailtosmsreportsComponent;
  let fixture: ComponentFixture<EmailtosmsreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailtosmsreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailtosmsreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
