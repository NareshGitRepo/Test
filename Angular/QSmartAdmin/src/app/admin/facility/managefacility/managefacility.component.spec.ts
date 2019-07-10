import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageFacilityComponent } from './managefacility.component';


describe('HospitalsclinicsComponent', () => {
  let component: ManageFacilityComponent;
  let fixture: ComponentFixture<ManageFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageFacilityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
