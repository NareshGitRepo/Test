import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetnotificationComponent } from './setnotification.component';

describe('SetnotificationComponent', () => {
  let component: SetnotificationComponent;
  let fixture: ComponentFixture<SetnotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetnotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetnotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
