import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailtosmsComponent } from './emailtosms.component';

describe('EmailtosmsComponent', () => {
  let component: EmailtosmsComponent;
  let fixture: ComponentFixture<EmailtosmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailtosmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailtosmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
