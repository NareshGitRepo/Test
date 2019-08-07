import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserquotadetailsComponent } from './userquotadetails.component';

describe('UserquotadetailsComponent', () => {
  let component: UserquotadetailsComponent;
  let fixture: ComponentFixture<UserquotadetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserquotadetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserquotadetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
