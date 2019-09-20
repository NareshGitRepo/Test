import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingcreateComponent } from './buildingcreate.component';

describe('BuildingcreateComponent', () => {
  let component: BuildingcreateComponent;
  let fixture: ComponentFixture<BuildingcreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingcreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
