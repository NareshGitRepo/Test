import { TestBed } from '@angular/core/testing';

import { DeauthGuardService } from './deauth-guard.service';

describe('DeauthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeauthGuardService = TestBed.get(DeauthGuardService);
    expect(service).toBeTruthy();
  });
});
