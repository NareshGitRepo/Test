import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaysareaComponent } from './displaysarea.component';

describe('DisplaysareaComponent', () => {
  let component: DisplaysareaComponent;
  let fixture: ComponentFixture<DisplaysareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaysareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaysareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
