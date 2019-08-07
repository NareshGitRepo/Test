import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaigndetailsComponent } from './campaigndetails.component';

describe('CampaigndetailsComponent', () => {
  let component: CampaigndetailsComponent;
  let fixture: ComponentFixture<CampaigndetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaigndetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaigndetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
