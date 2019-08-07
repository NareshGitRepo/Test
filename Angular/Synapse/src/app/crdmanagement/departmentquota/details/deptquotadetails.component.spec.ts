import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptquotadetailsComponent } from './deptquotadetails.component';

describe('DeptquotadetailsComponent', () => {
  let component: DeptquotadetailsComponent;
  let fixture: ComponentFixture<DeptquotadetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptquotadetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptquotadetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
