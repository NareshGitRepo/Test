import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { SimpleSMSComponent } from './simplesms.component';

describe('SimplesmsComponent', () => {
  let component: SimpleSMSComponent;
  let fixture: ComponentFixture<SimpleSMSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleSMSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleSMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
