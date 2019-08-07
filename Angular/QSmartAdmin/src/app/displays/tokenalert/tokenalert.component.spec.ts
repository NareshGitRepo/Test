import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenalertComponent } from './tokenalert.component';

describe('TokenalertComponent', () => {
  let component: TokenalertComponent;
  let fixture: ComponentFixture<TokenalertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenalertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenalertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
