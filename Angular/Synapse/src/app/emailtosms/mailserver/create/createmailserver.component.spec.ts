import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemailserverComponent } from './createmailserver.component';

describe('CreatemailserverComponent', () => {
  let component: CreatemailserverComponent;
  let fixture: ComponentFixture<CreatemailserverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatemailserverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatemailserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
