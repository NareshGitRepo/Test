import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmstoemaildetailsComponent } from './smstoemaildetails.component';

describe('SmstoemaildetailsComponent', () => {
  let component: SmstoemaildetailsComponent;
  let fixture: ComponentFixture<SmstoemaildetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmstoemaildetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmstoemaildetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
