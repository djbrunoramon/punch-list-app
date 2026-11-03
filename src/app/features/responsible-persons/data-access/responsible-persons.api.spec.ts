import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { aPage, aResponsiblePerson } from '../../../../testing/fixtures';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { ResponsiblePersonsApi } from './responsible-persons.api';
import { ResponsiblePersonRequest } from './responsible-persons.models';

const PERSON = aResponsiblePerson();

const REQUEST: ResponsiblePersonRequest = {
  idContract: 1,
  name: 'João Lima',
  occupation: 'Supervisor',
  department: 'Electrical',
};

describe('ResponsiblePersonsApi', () => {
  let api: ResponsiblePersonsApi;
  let httpTesting: HttpTestingController;

  function setup(baseUrl = ''): void {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: baseUrl },
      ],
    });
    api = TestBed.inject(ResponsiblePersonsApi);
    httpTesting = TestBed.inject(HttpTestingController);
  }

  afterEach(() => httpTesting.verify());

  it('lists a contract page sending page, size and sort', async () => {
    setup();
    const page = aPage([PERSON]);
    const result = firstValueFrom(
      api.listByContract(3, { page: 2, size: 10, sort: 'createdAt,asc' }),
    );
    const req = httpTesting.expectOne(
      (r) => r.method === 'GET' && r.url === '/api/v1/responsible-person/contract/3',
    );
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('size')).toBe('10');
    expect(req.request.params.get('sort')).toBe('createdAt,asc');
    req.flush(page);
    expect(await result).toEqual(page);
  });

  it('omits sort when none is requested and caps size at 100 (AM-06)', async () => {
    setup();
    const result = firstValueFrom(api.listByContract(3, { page: 0, size: 5000 }));
    const req = httpTesting.expectOne((r) => r.url === '/api/v1/responsible-person/contract/3');
    expect(req.request.params.has('sort')).toBe(false);
    expect(req.request.params.get('size')).toBe('100');
    req.flush(aPage([]));
    await result;
  });

  it('gets one person by id', async () => {
    setup();
    const result = firstValueFrom(api.get(1));
    httpTesting.expectOne({ method: 'GET', url: '/api/v1/responsible-person/1' }).flush(PERSON);
    expect(await result).toEqual(PERSON);
  });

  it('creates with POST and the request body', async () => {
    setup();
    const result = firstValueFrom(api.create(REQUEST));
    const req = httpTesting.expectOne({ method: 'POST', url: '/api/v1/responsible-person' });
    expect(req.request.body).toEqual(REQUEST);
    req.flush({ ...PERSON, ...REQUEST, id: 2 }, { status: 201, statusText: 'Created' });
    expect((await result).id).toBe(2);
  });

  it('updates with PUT /{id}', async () => {
    setup();
    const result = firstValueFrom(api.update(1, REQUEST));
    const req = httpTesting.expectOne({ method: 'PUT', url: '/api/v1/responsible-person/1' });
    expect(req.request.body).toEqual(REQUEST);
    req.flush({ ...PERSON, ...REQUEST });
    await result;
  });

  it('prefixes the configured API origin', async () => {
    setup('https://api.example.com');
    const result = firstValueFrom(api.get(1));
    httpTesting.expectOne('https://api.example.com/api/v1/responsible-person/1').flush(PERSON);
    await result;
  });
});
