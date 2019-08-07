import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualtokencreateComponent } from './manualtokencreate.component';

describe('ManualtokencreateComponent', () => {
  let component: ManualtokencreateComponent;
  let fixture: ComponentFixture<ManualtokencreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualtokencreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualtokencreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
