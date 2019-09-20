import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomcreateComponent } from './roomcreate.component';

describe('RoomcreateComponent', () => {
  let component: RoomcreateComponent;
  let fixture: ComponentFixture<RoomcreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomcreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
