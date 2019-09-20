import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NursemanageComponent } from './nursemanage.component';

describe('NursemanageComponent', () => {
  let component: NursemanageComponent;
  let fixture: ComponentFixture<NursemanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NursemanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursemanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
