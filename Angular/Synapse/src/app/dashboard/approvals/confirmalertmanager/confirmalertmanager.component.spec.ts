import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmalertmanagerComponent } from './confirmalertmanager.component';

describe('ConfirmalertmanagerComponent', () => {
  let component: ConfirmalertmanagerComponent;
  let fixture: ComponentFixture<ConfirmalertmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmalertmanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmalertmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
