import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingareaComponent } from './waitingarea.component';

describe('ReceptionareaComponent', () => {
  let component: WaitingareaComponent;
  let fixture: ComponentFixture<WaitingareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
