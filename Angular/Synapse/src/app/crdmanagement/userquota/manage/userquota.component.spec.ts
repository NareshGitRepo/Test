import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserquotaComponent } from './userquota.component';

describe('UserquotaComponent', () => {
  let component: UserquotaComponent;
  let fixture: ComponentFixture<UserquotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserquotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserquotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
