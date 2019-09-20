import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageservicesComponent } from './manageservices.component';

describe('ManageservicesComponent', () => {
  let component: ManageservicesComponent;
  let fixture: ComponentFixture<ManageservicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageservicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
