import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmdeptquotaComponent } from './confirmdeptquota.component';

describe('ConfirmdeptquotaComponent', () => {
  let component: ConfirmdeptquotaComponent;
  let fixture: ComponentFixture<ConfirmdeptquotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmdeptquotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmdeptquotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
