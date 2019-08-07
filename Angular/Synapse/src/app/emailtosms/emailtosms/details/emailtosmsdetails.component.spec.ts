import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailtosmsdetailsComponent } from './emailtosmsdetails.component';

describe('EmailtosmsdetailsComponent', () => {
  let component: EmailtosmsdetailsComponent;
  let fixture: ComponentFixture<EmailtosmsdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailtosmsdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailtosmsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
