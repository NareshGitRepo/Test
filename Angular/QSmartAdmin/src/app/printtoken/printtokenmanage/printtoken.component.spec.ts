import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PrinttokenManageComponent } from './printtoken.component';

describe('SuccessregistrationmanageComponent', () => {
  let component: PrinttokenManageComponent;
  let fixture: ComponentFixture<PrinttokenManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinttokenManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinttokenManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
