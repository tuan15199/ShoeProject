import { TestBed } from '@angular/core/testing';

import { PnotityService } from './pnotify.service';

describe('PnotityService', () => {
  let service: PnotityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PnotityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
