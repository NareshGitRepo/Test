import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CakeComponent } from './cake.component';

describe('CakeComponent', () => {
  let component: CakeComponent;
  let fixture: ComponentFixture<CakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
