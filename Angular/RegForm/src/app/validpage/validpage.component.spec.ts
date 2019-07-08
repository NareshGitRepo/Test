import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidpageComponent } from './validpage.component';

describe('ValidpageComponent', () => {
  let component: ValidpageComponent;
  let fixture: ComponentFixture<ValidpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
