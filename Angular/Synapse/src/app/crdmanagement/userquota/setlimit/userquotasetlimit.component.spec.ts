import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserquotasetlimitComponent } from './userquotasetlimit.component';

describe('UserquotasetlimitComponent', () => {
  let component: UserquotasetlimitComponent;
  let fixture: ComponentFixture<UserquotasetlimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserquotasetlimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserquotasetlimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
