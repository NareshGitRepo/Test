import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmcampaignComponent } from './confirmcampaign.component';

describe('ConfirmcampaignComponent', () => {
  let component: ConfirmcampaignComponent;
  let fixture: ComponentFixture<ConfirmcampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmcampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmcampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
