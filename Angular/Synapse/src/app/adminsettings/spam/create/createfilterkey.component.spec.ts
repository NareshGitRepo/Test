import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatefilterkeyComponent } from './createfilterkey.component';

describe('CreatefilterkeyComponent', () => {
  let component: CreatefilterkeyComponent;
  let fixture: ComponentFixture<CreatefilterkeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatefilterkeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatefilterkeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
