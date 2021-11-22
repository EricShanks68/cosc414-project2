import { TestBed } from '@angular/core/testing';

import { SphereDrawerService } from './sphere-drawer.service';

describe('SphereDrawerService', () => {
  let service: SphereDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SphereDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
