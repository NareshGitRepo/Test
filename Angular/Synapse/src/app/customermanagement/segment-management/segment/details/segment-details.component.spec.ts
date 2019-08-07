import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentDetailsComponent } from './segment-details.component';

describe('SegmentDetailsComponent', () => {
  let component: SegmentDetailsComponent;
  let fixture: ComponentFixture<SegmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
