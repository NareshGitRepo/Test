import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLicenseComponent } from './update-license.component';

describe('UpdateLicenseComponent', () => {
  let component: UpdateLicenseComponent;
  let fixture: ComponentFixture<UpdateLicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateLicenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
