import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentreportsComponent } from './departmentreports.component';

describe('DepartmentreportsComponent', () => {
  let component: DepartmentreportsComponent;
  let fixture: ComponentFixture<DepartmentreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
