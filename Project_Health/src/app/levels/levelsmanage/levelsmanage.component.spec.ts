import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelsmanageComponent } from './levelsmanage.component';

describe('LevelsmanageComponent', () => {
  let component: LevelsmanageComponent;
  let fixture: ComponentFixture<LevelsmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelsmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelsmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
