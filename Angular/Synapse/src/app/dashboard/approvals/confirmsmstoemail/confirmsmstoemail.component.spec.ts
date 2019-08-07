import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmsmstoemailComponent } from './confirmsmstoemail.component';

describe('ConfirmsmstoemailComponent', () => {
  let component: ConfirmsmstoemailComponent;
  let fixture: ComponentFixture<ConfirmsmstoemailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmsmstoemailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmsmstoemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
