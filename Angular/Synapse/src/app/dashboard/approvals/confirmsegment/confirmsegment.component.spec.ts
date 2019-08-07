import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmsegmentComponent } from './confirmsegment.component';

describe('ConfirmsegmentComponent', () => {
  let component: ConfirmsegmentComponent;
  let fixture: ComponentFixture<ConfirmsegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmsegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmsegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
