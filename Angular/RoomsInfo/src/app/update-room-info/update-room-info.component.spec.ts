import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoomInfoComponent } from './update-room-info.component';

describe('UpdateRoomInfoComponent', () => {
  let component: UpdateRoomInfoComponent;
  let fixture: ComponentFixture<UpdateRoomInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRoomInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRoomInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
