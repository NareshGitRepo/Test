import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpatientjourneyComponent } from './dpatientjourney.component';

describe('DpatientjourneyComponent', () => {
  let component: DpatientjourneyComponent;
  let fixture: ComponentFixture<DpatientjourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpatientjourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpatientjourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
