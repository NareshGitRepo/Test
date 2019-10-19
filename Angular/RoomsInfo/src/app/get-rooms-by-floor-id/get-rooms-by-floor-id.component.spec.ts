import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetRoomsByFloorIdComponent } from './get-rooms-by-floor-id.component';

describe('GetRoomsByFloorIdComponent', () => {
  let component: GetRoomsByFloorIdComponent;
  let fixture: ComponentFixture<GetRoomsByFloorIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetRoomsByFloorIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetRoomsByFloorIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
