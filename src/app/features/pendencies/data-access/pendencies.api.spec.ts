import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { aPage, aPendency } from '../../../../testing/fixtures';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PendenciesApi } from './pendencies.api';
import { PendencyRequest } from './pendencies.models';

const PENDENCY = aPendency();

const REQUEST: PendencyRequest = {
  idContract: 1,
  areaIdentification: 'Area 51',
  tag: null,
  description: 'Fix the cable tray',
  priority: 'HIGH',
  status: 'OPEN',
  discipline: 'Electrical',
  registeredBy: 1,
  registeredTo: 2,
  expectedIn: null,
  finishedBy: null,
  finishedAt: null,
  disapprovedBy: null,
  disapprovedAt: null,
  canceledBy: null,
  canceledAt: null,
};

describe('PendenciesApi', () => {
  let api: PendenciesApi;
  let httpTesting: HttpTestingController;

  function setup(baseUrl = ''): void {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: baseUrl },
      ],
    });
    api = TestBed.inject(PendenciesApi);
    httpTesting = TestBed.inject(HttpTestingController);
  }

  afterEach(() => httpTesting.verify());

  it('lists a contract page sending page, size and sort', async () => {
    setup();
    const page = aPage([PENDENCY]);
    const result = firstValueFrom(
      api.listByContract(3, { page: 1, size: 10, sort: 'createdAt,desc' }),
    );
    const req = httpTesting.expectOne(
      (r) => r.method === 'GET' && r.url === '/api/v1/pendency/contract/3',
    );
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.get('sort')).toBe('createdAt,desc');
    req.flush(page);
    expect(await result).toEqual(page);
  });

  it('gets one pendency by id', async () => {
    setup();
    const result = firstValueFrom(api.get(1));
    httpTesting.expectOne({ method: 'GET', url: '/api/v1/pendency/1' }).flush(PENDENCY);
    expect(await result).toEqual(PENDENCY);
  });

  it('creates with POST and the request body', async () => {
    setup();
    const result = firstValueFrom(api.create(REQUEST));
    const req = httpTesting.expectOne({ method: 'POST', url: '/api/v1/pendency' });
    expect(req.request.body).toEqual(REQUEST);
    req.flush({ ...PENDENCY, id: 2 }, { status: 201, statusText: 'Created' });
    expect((await result).id).toBe(2);
  });

  it('updates with PUT /{id}', async () => {
    setup();
    const result = firstValueFrom(api.update(1, REQUEST));
    const req = httpTesting.expectOne({ method: 'PUT', url: '/api/v1/pendency/1' });
    expect(req.request.body).toEqual(REQUEST);
    req.flush(PENDENCY);
    await result;
  });

  it('prefixes the configured API origin', async () => {
    setup('https://api.example.com');
    const result = firstValueFrom(api.get(1));
    httpTesting.expectOne('https://api.example.com/api/v1/pendency/1').flush(PENDENCY);
    await result;
  });
});
