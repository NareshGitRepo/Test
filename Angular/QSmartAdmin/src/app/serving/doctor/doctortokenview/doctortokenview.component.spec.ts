import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctortokenviewComponent } from './doctortokenview.component';

describe('DoctortokenviewComponent', () => {
  let component: DoctortokenviewComponent;
  let fixture: ComponentFixture<DoctortokenviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctortokenviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctortokenviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
