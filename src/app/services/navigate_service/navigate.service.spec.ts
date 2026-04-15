import { TestBed } from '@angular/core/testing';

import { NavigateService } from './navigate.service';

describe('NavigateService', () => {
  let service: NavigateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get showPutArticles correctly', () => {
    
    service.setShowPutArticles(true);
    expect(service.getShowPutArticles()).toBeTrue();

    service.setShowPutArticles(false);
    expect(service.getShowPutArticles()).toBeFalse();
  });
});
