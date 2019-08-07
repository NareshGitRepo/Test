import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinealertsComponent } from './offlinealerts.component';

describe('OfflinealertsComponent', () => {
  let component: OfflinealertsComponent;
  let fixture: ComponentFixture<OfflinealertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflinealertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinealertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
