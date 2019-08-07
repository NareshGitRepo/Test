import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagetrackingComponent } from './messagetracking.component';

describe('MessagetrackingComponent', () => {
  let component: MessagetrackingComponent;
  let fixture: ComponentFixture<MessagetrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagetrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagetrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
