import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinealertsComponent } from './onlinealerts.component';

describe('OnlinealertsComponent', () => {
  let component: OnlinealertsComponent;
  let fixture: ComponentFixture<OnlinealertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinealertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinealertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
