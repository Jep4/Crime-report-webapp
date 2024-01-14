import { TestBed } from '@angular/core/testing';

import { SharedLocationService } from './shared-location.service';

describe('SharedLocationService', () => {
  let service: SharedLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
