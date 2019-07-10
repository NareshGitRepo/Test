import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypecreateComponent } from './servicetypecreate.component';

describe('ServiceTypecreateComponent', () => {
  let component: ServiceTypecreateComponent;
  let fixture: ComponentFixture<ServiceTypecreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTypecreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
