import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignreportsComponent } from './campaignreports.component';

describe('CampaignreportsComponent', () => {
  let component: CampaignreportsComponent;
  let fixture: ComponentFixture<CampaignreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
