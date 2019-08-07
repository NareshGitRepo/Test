import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptquotasetlimitComponent } from './deptquotasetlimit.component';

describe('DeptquotasetlimitComponent', () => {
  let component: DeptquotasetlimitComponent;
  let fixture: ComponentFixture<DeptquotasetlimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptquotasetlimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptquotasetlimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
