import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatesmstoemailComponent } from './createsmstoemail.component';

describe('CreatesmstoemailComponent', () => {
  let component: CreatesmstoemailComponent;
  let fixture: ComponentFixture<CreatesmstoemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatesmstoemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatesmstoemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
