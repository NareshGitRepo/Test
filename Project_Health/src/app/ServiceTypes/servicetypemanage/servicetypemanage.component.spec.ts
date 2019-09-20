import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceTypeManageComponent } from './servicetypemanage.component';

describe('ServiceTypeManageComponent', () => {
  let component: ServiceTypeManageComponent;
  let fixture: ComponentFixture<ServiceTypeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTypeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
