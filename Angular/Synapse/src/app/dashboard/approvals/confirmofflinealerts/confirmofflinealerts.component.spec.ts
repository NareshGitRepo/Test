import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmofflinealertsComponent } from './confirmofflinealerts.component';

describe('ConfirmofflinealertsComponent', () => {
  let component: ConfirmofflinealertsComponent;
  let fixture: ComponentFixture<ConfirmofflinealertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmofflinealertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmofflinealertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
