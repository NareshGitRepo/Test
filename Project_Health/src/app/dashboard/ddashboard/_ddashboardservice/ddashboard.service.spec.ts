import { TestBed } from '@angular/core/testing';

import { DdashboardService } from './ddashboard.service';

describe('DdashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DdashboardService = TestBed.get(DdashboardService);
    expect(service).toBeTruthy();
  });
});
