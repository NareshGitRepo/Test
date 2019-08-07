import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateemailtosmsComponent } from './createemailtosms.component';

describe('CreateemailtosmsComponent', () => {
  let component: CreateemailtosmsComponent;
  let fixture: ComponentFixture<CreateemailtosmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateemailtosmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateemailtosmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
