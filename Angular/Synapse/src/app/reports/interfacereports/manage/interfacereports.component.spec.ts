import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfacereportsComponent } from './interfacereports.component';

describe('InterfacereportsComponent', () => {
  let component: InterfacereportsComponent;
  let fixture: ComponentFixture<InterfacereportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterfacereportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfacereportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
