import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualtokenComponent } from './manualtoken.component';

describe('ManualtokenComponent', () => {
  let component: ManualtokenComponent;
  let fixture: ComponentFixture<ManualtokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualtokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualtokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
