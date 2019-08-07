import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterkeyComponent } from './filterkey.component';


describe('FilterkeyComponent', () => {
  let component: FilterkeyComponent;
  let fixture: ComponentFixture<FilterkeyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterkeyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterkeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
