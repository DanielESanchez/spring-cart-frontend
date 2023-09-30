import { TestBed } from '@angular/core/testing';

import { SignalCartService } from './signal-cart.service';

describe('SignalCartService', () => {
  let service: SignalCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
