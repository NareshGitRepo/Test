import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmgroupComponent } from './confirmgroup.component';

describe('ConfirmgroupComponent', () => {
  let component: ConfirmgroupComponent;
  let fixture: ComponentFixture<ConfirmgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
