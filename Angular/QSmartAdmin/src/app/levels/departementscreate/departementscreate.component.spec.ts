import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartementscreateComponent } from './departementscreate.component';

describe('DepartementscreateComponent', () => {
  let component: DepartementscreateComponent;
  let fixture: ComponentFixture<DepartementscreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartementscreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartementscreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
