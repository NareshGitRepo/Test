import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgcircleComponent } from './svgcircle.component';

describe('SvgcircleComponent', () => {
  let component: SvgcircleComponent;
  let fixture: ComponentFixture<SvgcircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgcircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgcircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
