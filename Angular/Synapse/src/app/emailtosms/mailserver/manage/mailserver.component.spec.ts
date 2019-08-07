import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailserverComponent } from './mailserver.component';

describe('MailserverComponent', () => {
  let component: MailserverComponent;
  let fixture: ComponentFixture<MailserverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailserverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
