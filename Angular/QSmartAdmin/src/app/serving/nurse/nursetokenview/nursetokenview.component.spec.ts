import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NursetokenviewComponent } from './nursetokenview.component';

describe('NursetokenviewComponent', () => {
  let component: NursetokenviewComponent;
  let fixture: ComponentFixture<NursetokenviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NursetokenviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursetokenviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
