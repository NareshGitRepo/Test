import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalsettingsComponent } from './globalsettings.component';

describe('GlobalsettingsComponent', () => {
  let component: GlobalsettingsComponent;
  let fixture: ComponentFixture<GlobalsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
