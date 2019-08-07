import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemtComponent } from './createmt.component';

describe('CreatemtComponent', () => {
  let component: CreatemtComponent;
  let fixture: ComponentFixture<CreatemtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatemtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatemtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
