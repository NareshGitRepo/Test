import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessmanageComponent } from './successmanage.component';

describe('SuccessregistrationmanageComponent', () => {
  let component: SuccessmanageComponent;
  let fixture: ComponentFixture<SuccessmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
