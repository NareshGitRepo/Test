import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenreportsComponent } from './tokenreports.component';

describe('TokenreportsComponent', () => {
  let component: TokenreportsComponent;
  let fixture: ComponentFixture<TokenreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
