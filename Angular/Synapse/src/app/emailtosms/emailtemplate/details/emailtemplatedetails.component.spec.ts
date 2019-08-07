import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailTemplateDetailsComponent } from './emailtemplatedetails.component';

describe('SmstoemaildetailsComponent', () => {
  let component: EmailTemplateDetailsComponent;
  let fixture: ComponentFixture<EmailTemplateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailTemplateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
