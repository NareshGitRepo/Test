import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilemanageComponent } from './profilemanage.component';

describe('ProfilemanageComponent', () => {
  let component: ProfilemanageComponent;
  let fixture: ComponentFixture<ProfilemanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilemanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilemanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
