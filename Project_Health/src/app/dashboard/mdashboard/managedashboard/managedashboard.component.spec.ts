import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdashboardComponent } from './managedashboard.component';



describe('ManagemdashboardComponent', () => {
  let component: MdashboardComponent;
  let fixture: ComponentFixture<MdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
