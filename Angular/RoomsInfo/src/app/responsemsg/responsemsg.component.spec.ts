import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsemsgComponent } from './responsemsg.component';

describe('ResponsemsgComponent', () => {
  let component: ResponsemsgComponent;
  let fixture: ComponentFixture<ResponsemsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsemsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsemsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
