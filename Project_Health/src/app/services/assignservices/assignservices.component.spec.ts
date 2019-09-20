import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignservicesComponent } from './assignservices.component';

describe('AssignservicesComponent', () => {
  let component: AssignservicesComponent;
  let fixture: ComponentFixture<AssignservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignservicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
