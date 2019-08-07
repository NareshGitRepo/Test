import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmserviceComponent } from './confirmservice.component';

describe('ConfirmserviceComponent', () => {
  let component: ConfirmserviceComponent;
  let fixture: ComponentFixture<ConfirmserviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmserviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
