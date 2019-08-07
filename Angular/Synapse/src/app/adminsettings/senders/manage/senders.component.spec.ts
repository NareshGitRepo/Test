import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendersComponent } from './senders.component';

describe('SendersComponent', () => {
  let component: SendersComponent;
  let fixture: ComponentFixture<SendersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
