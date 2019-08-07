import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctortokentransferComponent } from './doctortokentransfer.component';

describe('DoctortokentransferComponent', () => {
  let component: DoctortokentransferComponent;
  let fixture: ComponentFixture<DoctortokentransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctortokentransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctortokentransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
