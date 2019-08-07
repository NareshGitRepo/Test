import { TestBed } from '@angular/core/testing';

import { PrivilegesService } from './privileges.service';

describe('PrivilegesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrivilegesService = TestBed.get(PrivilegesService);
    expect(service).toBeTruthy();
  });
});
