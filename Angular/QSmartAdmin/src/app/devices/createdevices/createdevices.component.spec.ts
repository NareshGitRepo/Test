import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedevicesComponent } from './createdevices.component';

describe('CreatedevicesComponent', () => {
  let component: CreatedevicesComponent;
  let fixture: ComponentFixture<CreatedevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
