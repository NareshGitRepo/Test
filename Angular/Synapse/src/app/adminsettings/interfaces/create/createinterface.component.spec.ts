import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateinterfaceComponent } from './createinterface.component';

describe('CreateinterfaceComponent', () => {
  let component: CreateinterfaceComponent;
  let fixture: ComponentFixture<CreateinterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateinterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateinterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
