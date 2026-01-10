import { TestBed } from '@angular/core/testing';

import { SqliteManagerService } from './sqlite-manager.service';

describe('SqliteManagerService', () => {
  let service: SqliteManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqliteManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
