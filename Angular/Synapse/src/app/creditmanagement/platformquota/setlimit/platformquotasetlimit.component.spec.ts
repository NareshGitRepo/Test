import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformquotasetlimitComponent } from './platformquotasetlimit.component';

describe('PlatformquotasetlimitComponent', () => {
  let component: PlatformquotasetlimitComponent;
  let fixture: ComponentFixture<PlatformquotasetlimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformquotasetlimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformquotasetlimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
