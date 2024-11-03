import { TestBed } from '@angular/core/testing';

import { CitysearchService } from './citysearch.service';

describe('CitysearchService', () => {
  let service: CitysearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitysearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
