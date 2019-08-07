import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinealertdetailsComponent } from './onlinealertdetails.component';

describe('OnlinealertdetailsComponent', () => {
  let component: OnlinealertdetailsComponent;
  let fixture: ComponentFixture<OnlinealertdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinealertdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinealertdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
