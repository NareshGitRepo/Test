import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmtemplateComponent } from './confirmtemplate.component';

describe('ConfirmtemplateComponent', () => {
  let component: ConfirmtemplateComponent;
  let fixture: ComponentFixture<ConfirmtemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmtemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
