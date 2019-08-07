import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmspamComponent } from './confirmspam.component';

describe('ConfirmspamComponent', () => {
  let component: ConfirmspamComponent;
  let fixture: ComponentFixture<ConfirmspamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmspamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmspamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
