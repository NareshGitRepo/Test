import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PrioritizationComponent } from './prioritization.component';

describe('PrioritizationComponent', () => {
  let component: PrioritizationComponent;
  let fixture: ComponentFixture<PrioritizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrioritizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrioritizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
