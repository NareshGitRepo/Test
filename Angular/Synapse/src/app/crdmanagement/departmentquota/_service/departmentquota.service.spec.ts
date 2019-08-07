import { TestBed } from '@angular/core/testing';

import { DepartmentquotaService } from './departmentquota.service';

describe('DepartmentquotaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DepartmentquotaService = TestBed.get(DepartmentquotaService);
    expect(service).toBeTruthy();
  });
});
