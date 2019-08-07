import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentquotamanageComponent } from './departmentquotamanage.component';

describe('DepartmentquotamanageComponent', () => {
  let component: DepartmentquotamanageComponent;
  let fixture: ComponentFixture<DepartmentquotamanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentquotamanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentquotamanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
