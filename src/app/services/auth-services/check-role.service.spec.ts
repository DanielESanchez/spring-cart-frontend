import { TestBed } from '@angular/core/testing';

import { CheckRoleService } from './check-role.service';

describe('CheckRoleService', () => {
  let service: CheckRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
