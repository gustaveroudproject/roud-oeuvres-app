import { TestBed } from '@angular/core/testing';

import { AppInitService } from './app-init.service';

describe('AppInitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppInitService = TestBed.inject(AppInitService);
    expect(service).toBeTruthy();
  });
});
