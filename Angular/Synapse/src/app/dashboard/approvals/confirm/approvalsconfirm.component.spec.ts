import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsconfirmComponent } from './approvalsconfirm.component';

describe('ApprovalsconfirmComponent', () => {
  let component: ApprovalsconfirmComponent;
  let fixture: ComponentFixture<ApprovalsconfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalsconfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalsconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
