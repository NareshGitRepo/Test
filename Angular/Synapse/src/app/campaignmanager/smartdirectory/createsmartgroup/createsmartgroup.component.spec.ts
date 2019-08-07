import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatesmartgroupComponent } from './createsmartgroup.component';

describe('CreatesmartgroupComponent', () => {
  let component: CreatesmartgroupComponent;
  let fixture: ComponentFixture<CreatesmartgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatesmartgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatesmartgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
