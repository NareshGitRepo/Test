import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokentransformComponent } from './tokentransform.component';

describe('TokentransformComponent', () => {
  let component: TokentransformComponent;
  let fixture: ComponentFixture<TokentransformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokentransformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokentransformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
