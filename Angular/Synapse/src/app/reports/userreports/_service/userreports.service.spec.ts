import { TestBed } from '@angular/core/testing';

import { UserreportsService } from './userreports.service';

describe('UserreportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserreportsService = TestBed.get(UserreportsService);
    expect(service).toBeTruthy();
  });
});
