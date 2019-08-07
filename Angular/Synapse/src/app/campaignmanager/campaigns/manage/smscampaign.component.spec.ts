import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmscampaignComponent } from './smscampaign.component';

describe('SmscampaignComponent', () => {
  let component: SmscampaignComponent;
  let fixture: ComponentFixture<SmscampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmscampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmscampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
