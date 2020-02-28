import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgcricleComponent } from './svgcricle.component';

describe('SvgcricleComponent', () => {
  let component: SvgcricleComponent;
  let fixture: ComponentFixture<SvgcricleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgcricleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgcricleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
