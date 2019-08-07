import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmdepartmentComponent } from './confirmdepartment.component';

describe('ConfirmdepartmentComponent', () => {
  let component: ConfirmdepartmentComponent;
  let fixture: ComponentFixture<ConfirmdepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmdepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmdepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
