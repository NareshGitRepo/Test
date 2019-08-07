import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercreditreportsComponent } from './usercreditreports.component';

describe('UsercreditreportsComponent', () => {
  let component: UsercreditreportsComponent;
  let fixture: ComponentFixture<UsercreditreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsercreditreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsercreditreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
