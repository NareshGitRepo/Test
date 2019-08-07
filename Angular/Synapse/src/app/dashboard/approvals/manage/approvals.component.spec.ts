import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovalspageComponent } from './approvals.component';


describe('ApprovalspageComponent', () => {
  let component: ApprovalspageComponent;
  let fixture: ComponentFixture<ApprovalspageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
