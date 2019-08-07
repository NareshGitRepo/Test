import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateonlinealertComponent } from './createonlinealert.component';

describe('CreateonlinealertComponent', () => {
  let component: CreateonlinealertComponent;
  let fixture: ComponentFixture<CreateonlinealertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateonlinealertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateonlinealertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
