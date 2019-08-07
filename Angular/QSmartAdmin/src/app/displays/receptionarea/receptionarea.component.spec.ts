import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionareaComponent } from './receptionarea.component';

describe('ReceptionareaComponent', () => {
  let component: ReceptionareaComponent;
  let fixture: ComponentFixture<ReceptionareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceptionareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceptionareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
