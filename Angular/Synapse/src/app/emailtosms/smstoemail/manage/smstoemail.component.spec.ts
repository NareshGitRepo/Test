import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmstoemailComponent } from './smstoemail.component';

describe('SmstoemailComponent', () => {
  let component: SmstoemailComponent;
  let fixture: ComponentFixture<SmstoemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmstoemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmstoemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
