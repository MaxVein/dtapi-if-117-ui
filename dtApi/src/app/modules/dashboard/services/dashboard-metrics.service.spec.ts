import { TestBed } from '@angular/core/testing';

import { DashboardMetricsService } from './dashboard-metrics.service';

describe('DashboardMetricsService', () => {
  let service: DashboardMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
