import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoommanageComponent } from './roommanage.component';

describe('RoommanageComponent', () => {
  let component: RoommanageComponent;
  let fixture: ComponentFixture<RoommanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoommanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoommanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
