import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokensurveComponent } from './tokensurve.component';

describe('TokensurveComponent', () => {
  let component: TokensurveComponent;
  let fixture: ComponentFixture<TokensurveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokensurveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokensurveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
