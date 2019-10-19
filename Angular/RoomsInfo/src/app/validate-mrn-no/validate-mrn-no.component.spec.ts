import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateMrnNoComponent } from './validate-mrn-no.component';

describe('ValidateMrnNoComponent', () => {
  let component: ValidateMrnNoComponent;
  let fixture: ComponentFixture<ValidateMrnNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateMrnNoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateMrnNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
