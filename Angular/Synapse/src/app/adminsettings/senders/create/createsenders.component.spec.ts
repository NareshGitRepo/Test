import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatesendersComponent } from './createsenders.component';

describe('CreatesendersComponent', () => {
  let component: CreatesendersComponent;
  let fixture: ComponentFixture<CreatesendersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatesendersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatesendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
