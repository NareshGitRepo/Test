import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtokentimeviewComponent } from './dtokentimeview.component';

describe('DtokentimeviewComponent', () => {
  let component: DtokentimeviewComponent;
  let fixture: ComponentFixture<DtokentimeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtokentimeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtokentimeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
