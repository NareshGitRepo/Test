import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioritydetailsComponent } from './prioritydetails.component';

describe('PrioritydetailsComponent', () => {
  let component: PrioritydetailsComponent;
  let fixture: ComponentFixture<PrioritydetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrioritydetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrioritydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
