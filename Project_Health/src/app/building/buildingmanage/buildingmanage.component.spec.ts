import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingmanageComponent } from './buildingmanage.component';

describe('BuildingmanageComponent', () => {
  let component: BuildingmanageComponent;
  let fixture: ComponentFixture<BuildingmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
