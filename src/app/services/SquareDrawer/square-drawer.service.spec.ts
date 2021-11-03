import { TestBed } from '@angular/core/testing';

import { SquareDrawerService } from './square-drawer.service';

describe('CircleDrawerService', () => {
  let service: SquareDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SquareDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
