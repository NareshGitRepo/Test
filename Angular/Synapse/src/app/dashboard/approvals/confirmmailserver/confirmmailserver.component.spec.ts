import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmmailserverComponent } from './confirmmailserver.component';

describe('ConfirmmailserverComponent', () => {
  let component: ConfirmmailserverComponent;
  let fixture: ComponentFixture<ConfirmmailserverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmmailserverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmmailserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
