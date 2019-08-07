import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenstimeviewComponent } from './tokenstimeview.component';

describe('TokenstimeviewComponent', () => {
  let component: TokenstimeviewComponent;
  let fixture: ComponentFixture<TokenstimeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenstimeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenstimeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
