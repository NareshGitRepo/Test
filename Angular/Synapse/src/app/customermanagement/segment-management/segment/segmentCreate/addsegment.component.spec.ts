import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsegmentComponent } from './addsegment.component';

describe('AddsegmentComponent', () => {
  let component: AddsegmentComponent;
  let fixture: ComponentFixture<AddsegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
