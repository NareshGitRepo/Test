import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServingtokenviewComponent } from './servingtokenview.component';

describe('ServingtokenviewComponent', () => {
  let component: ServingtokenviewComponent;
  let fixture: ComponentFixture<ServingtokenviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServingtokenviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServingtokenviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
