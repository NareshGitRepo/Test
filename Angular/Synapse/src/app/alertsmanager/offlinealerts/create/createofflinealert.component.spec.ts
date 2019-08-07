import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { CreatealertComponent } from './createofflinealert.component';

describe('CreatealertComponent', () => {
  let component: CreatealertComponent;
  let fixture: ComponentFixture<CreatealertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatealertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatealertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
