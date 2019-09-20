import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayerrorComponent } from './displayerror.component';

describe('DisplayerrorComponent', () => {
  let component: DisplayerrorComponent;
  let fixture: ComponentFixture<DisplayerrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayerrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayerrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
