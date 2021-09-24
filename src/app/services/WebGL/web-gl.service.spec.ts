import { TestBed } from '@angular/core/testing';

import { WebGLService } from './web-gl.service';

describe('WebGLService', () => {
  let service: WebGLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebGLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
