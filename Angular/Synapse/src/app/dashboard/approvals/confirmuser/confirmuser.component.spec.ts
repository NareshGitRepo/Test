import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmuserComponent } from './confirmuser.component';

describe('ConfirmuserComponent', () => {
  let component: ConfirmuserComponent;
  let fixture: ComponentFixture<ConfirmuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
