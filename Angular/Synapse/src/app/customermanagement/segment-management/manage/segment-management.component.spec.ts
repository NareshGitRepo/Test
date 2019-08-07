import { SegmentManagementComponent } from './segment-management.component';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

describe('SegmentManagementComponent', () => {
  let component: SegmentManagementComponent;
  let fixture: ComponentFixture<SegmentManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
