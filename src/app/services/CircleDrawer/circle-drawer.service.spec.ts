import { TestBed } from '@angular/core/testing';

import { CircleDrawerService } from './circle-drawer.service';

describe('CircleDrawerService', () => {
  let service: CircleDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CircleDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
