import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupusersComponent } from './groupusers.component';

describe('GroupusersComponent', () => {
  let component: GroupusersComponent;
  let fixture: ComponentFixture<GroupusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
