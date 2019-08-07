import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedepartmentComponent } from './createdepartment.component';

describe('CreatedepartmentComponent', () => {
  let component: CreatedepartmentComponent;
  let fixture: ComponentFixture<CreatedepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
