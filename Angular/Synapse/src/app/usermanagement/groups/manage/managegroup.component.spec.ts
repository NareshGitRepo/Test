import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupComponent } from './managegroup.component';

describe('ManageGroupComponent', () => {
  let component: ManageGroupComponent;
  let fixture: ComponentFixture<ManageGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
