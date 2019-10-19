import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectWithAllcheckboxComponent } from './multi-select-with-allcheckbox.component';

describe('MultiSelectWithAllcheckboxComponent', () => {
  let component: MultiSelectWithAllcheckboxComponent;
  let fixture: ComponentFixture<MultiSelectWithAllcheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectWithAllcheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectWithAllcheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
