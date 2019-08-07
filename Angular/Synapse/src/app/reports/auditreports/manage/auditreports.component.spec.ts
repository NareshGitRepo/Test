import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditreportsComponent } from './auditreports.component';

describe('AuditreportsComponent', () => {
  let component: AuditreportsComponent;
  let fixture: ComponentFixture<AuditreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
