import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmsenderComponent } from './confirmsender.component';

describe('ConfirmsenderComponent', () => {
  let component: ConfirmsenderComponent;
  let fixture: ComponentFixture<ConfirmsenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmsenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmsenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
