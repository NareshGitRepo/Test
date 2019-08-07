import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartdirectoryComponent } from './smartdirectory.component';

describe('SmartdirectoryComponent', () => {
  let component: SmartdirectoryComponent;
  let fixture: ComponentFixture<SmartdirectoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartdirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartdirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
