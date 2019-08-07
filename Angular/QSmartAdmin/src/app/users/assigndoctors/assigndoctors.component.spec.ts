import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigndoctorsComponent } from './assigndoctors.component';

describe('AssigndoctorsComponent', () => {
  let component: AssigndoctorsComponent;
  let fixture: ComponentFixture<AssigndoctorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigndoctorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigndoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
