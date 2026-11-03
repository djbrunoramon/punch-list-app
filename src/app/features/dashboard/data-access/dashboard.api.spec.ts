import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { DashboardApi } from './dashboard.api';
import { PriorityCount, StatusCount } from './dashboard.models';

describe('DashboardApi', () => {
  let api: DashboardApi;
  let httpTesting: HttpTestingController;

  function setup(baseUrl = ''): void {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: baseUrl },
      ],
    });
    api = TestBed.inject(DashboardApi);
    httpTesting = TestBed.inject(HttpTestingController);
  }

  afterEach(() => httpTesting.verify());

  it('gets the pie data of the contract', async () => {
    setup();
    const body: StatusCount[] = [
      { label: 'OPEN', quantity: 3 },
      { label: 'CLOSED', quantity: 1 },
    ];
    const result = firstValueFrom(api.byStatus(7));
    httpTesting
      .expectOne({ method: 'GET', url: '/api/v1/pendency/contract/7/chart/pie' })
      .flush(body);
    expect(await result).toEqual(body);
  });

  it('gets the bar data of the contract for a status', async () => {
    setup();
    const body: PriorityCount[] = [{ priority: 'HIGH', quantity: 2 }];
    const result = firstValueFrom(api.byPriority(7, 'DISAPPROVED'));
    httpTesting
      .expectOne({ method: 'GET', url: '/api/v1/pendency/contract/7/chart/bar/DISAPPROVED' })
      .flush(body);
    expect(await result).toEqual(body);
  });

  it('prefixes the configured API origin', async () => {
    setup('https://api.example.com');
    const result = firstValueFrom(api.byStatus(1));
    httpTesting.expectOne('https://api.example.com/api/v1/pendency/contract/1/chart/pie').flush([]);
    expect(await result).toEqual([]);
  });
});
