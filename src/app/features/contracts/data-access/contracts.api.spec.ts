import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { ContractsApi } from './contracts.api';
import { aContract } from '../../../../testing/fixtures';
import { Contract, ContractRequest } from './contracts.models';

const CONTRACT: Contract = aContract();

const REQUEST: ContractRequest = {
  numberContract: 'BR2026-002',
  description: 'Substation',
  address: 'Belém-PA-BR',
  startAt: null,
  scheduledTo: null,
  estimatedAt: null,
};

describe('ContractsApi', () => {
  let api: ContractsApi;
  let httpTesting: HttpTestingController;

  function setup(baseUrl = ''): void {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: baseUrl },
      ],
    });
    api = TestBed.inject(ContractsApi);
    httpTesting = TestBed.inject(HttpTestingController);
  }

  afterEach(() => httpTesting.verify());

  it('lists contracts (GET /api/v1/contract)', async () => {
    setup();
    const result = firstValueFrom(api.list());
    const req = httpTesting.expectOne('/api/v1/contract');
    expect(req.request.method).toBe('GET');
    req.flush([CONTRACT]);
    expect(await result).toEqual([CONTRACT]);
  });

  it('gets one contract by id', async () => {
    setup();
    const result = firstValueFrom(api.get(1));
    httpTesting.expectOne({ method: 'GET', url: '/api/v1/contract/1' }).flush(CONTRACT);
    expect(await result).toEqual(CONTRACT);
  });

  it('creates with POST and the request body', async () => {
    setup();
    const result = firstValueFrom(api.create(REQUEST));
    const req = httpTesting.expectOne({ method: 'POST', url: '/api/v1/contract' });
    expect(req.request.body).toEqual(REQUEST);
    req.flush({ ...CONTRACT, ...REQUEST, id: 2 }, { status: 201, statusText: 'Created' });
    expect((await result).id).toBe(2);
  });

  it('updates with PUT /{id}', async () => {
    setup();
    const result = firstValueFrom(api.update(1, REQUEST));
    const req = httpTesting.expectOne({ method: 'PUT', url: '/api/v1/contract/1' });
    expect(req.request.body).toEqual(REQUEST);
    req.flush({ ...CONTRACT, ...REQUEST });
    await result;
  });

  it('prefixes the configured API origin', async () => {
    setup('https://api.example.com');
    const result = firstValueFrom(api.list());
    httpTesting.expectOne('https://api.example.com/api/v1/contract').flush([]);
    expect(await result).toEqual([]);
  });
});
