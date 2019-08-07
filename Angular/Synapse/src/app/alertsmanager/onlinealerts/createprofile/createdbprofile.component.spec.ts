import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDBprofileComponent } from './createdbprofile.component';

describe('CreateprofileComponent', () => {
  let component: CreateDBprofileComponent;
  let fixture: ComponentFixture<CreateDBprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDBprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDBprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
