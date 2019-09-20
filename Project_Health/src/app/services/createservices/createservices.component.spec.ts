import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateservicesComponent } from './createservices.component';

describe('CreateservicesComponent', () => {
  let component: CreateservicesComponent;
  let fixture: ComponentFixture<CreateservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateservicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
