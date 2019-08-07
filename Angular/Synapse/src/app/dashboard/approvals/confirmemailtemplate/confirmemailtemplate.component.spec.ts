import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmemailtemplateComponent } from './confirmemailtemplate.component';

describe('ConfirmemailtemplateComponent', () => {
  let component: ConfirmemailtemplateComponent;
  let fixture: ComponentFixture<ConfirmemailtemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmemailtemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmemailtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
