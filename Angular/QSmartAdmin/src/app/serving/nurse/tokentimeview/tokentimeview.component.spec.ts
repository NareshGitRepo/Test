import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokentimeviewComponent } from './tokentimeview.component';

describe('TokentimeviewComponent', () => {
  let component: TokentimeviewComponent;
  let fixture: ComponentFixture<TokentimeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokentimeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokentimeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
