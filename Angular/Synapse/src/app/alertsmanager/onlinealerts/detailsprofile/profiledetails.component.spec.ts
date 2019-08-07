import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiledetailsComponent } from './profiledetails.component';

describe('ProfiledetailsComponent', () => {
  let component: ProfiledetailsComponent;
  let fixture: ComponentFixture<ProfiledetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfiledetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfiledetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
