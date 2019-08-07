import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailserverdetailsComponent } from './mailserverdetails.component';

describe('MailserverdetailsComponent', () => {
  let component: MailserverdetailsComponent;
  let fixture: ComponentFixture<MailserverdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailserverdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailserverdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
