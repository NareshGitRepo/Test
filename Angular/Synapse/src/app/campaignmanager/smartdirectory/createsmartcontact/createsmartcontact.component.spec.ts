import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatesmartcontactComponent } from './createsmartcontact.component';

describe('CreatesmartcontactComponent', () => {
  let component: CreatesmartcontactComponent;
  let fixture: ComponentFixture<CreatesmartcontactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatesmartcontactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatesmartcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
