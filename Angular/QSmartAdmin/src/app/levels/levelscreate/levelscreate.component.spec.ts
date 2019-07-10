import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelscreateComponent } from './levelscreate.component';

describe('LevelscreateComponent', () => {
  let component: LevelscreateComponent;
  let fixture: ComponentFixture<LevelscreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelscreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelscreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
