import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptquotahistoryComponent } from './deptquotahistory.component';

describe('DeptquotahistoryComponent', () => {
  let component: DeptquotahistoryComponent;
  let fixture: ComponentFixture<DeptquotahistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptquotahistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptquotahistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
