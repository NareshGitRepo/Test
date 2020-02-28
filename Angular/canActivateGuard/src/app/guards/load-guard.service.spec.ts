import { TestBed } from '@angular/core/testing';

import { LoadGuardService } from './load-guard.service';

describe('LoadGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadGuardService = TestBed.get(LoadGuardService);
    expect(service).toBeTruthy();
  });
});
