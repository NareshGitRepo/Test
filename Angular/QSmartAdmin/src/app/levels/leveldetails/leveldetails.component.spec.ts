import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeveldetailsComponent } from './leveldetails.component';

describe('LeveldetailsComponent', () => {
  let component: LeveldetailsComponent;
  let fixture: ComponentFixture<LeveldetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeveldetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeveldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
