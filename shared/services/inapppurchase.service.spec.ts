import { TestBed } from '@angular/core/testing';

import { InapppurchaseService } from './inapppurchase.service';

describe('InapppurchaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InapppurchaseService = TestBed.get(InapppurchaseService);
    expect(service).toBeTruthy();
  });
});
