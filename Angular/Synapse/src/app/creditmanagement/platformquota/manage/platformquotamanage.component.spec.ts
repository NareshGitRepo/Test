import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformquotamanageComponent } from './platformquotamanage.component';

describe('PlatformquotamanageComponent', () => {
  let component: PlatformquotamanageComponent;
  let fixture: ComponentFixture<PlatformquotamanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformquotamanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformquotamanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
