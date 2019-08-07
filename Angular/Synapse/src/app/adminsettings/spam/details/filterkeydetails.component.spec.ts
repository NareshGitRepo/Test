import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterkeydetailsComponent } from './filterkeydetails.component';

describe('FilterkeydetailsComponent', () => {
  let component: FilterkeydetailsComponent;
  let fixture: ComponentFixture<FilterkeydetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterkeydetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterkeydetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
