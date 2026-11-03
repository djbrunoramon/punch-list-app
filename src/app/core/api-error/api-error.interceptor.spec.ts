import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ApiError, toApiError } from './api-error';
import { apiErrorInterceptor } from './api-error.interceptor';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  async function failWith(
    body: object | string,
    status: number,
    statusText = 'Error',
  ): Promise<ApiError> {
    const result = firstValueFrom(http.get('/api/v1/contract/1'));
    httpTesting.expectOne('/api/v1/contract/1').flush(body, { status, statusText });
    try {
      await result;
    } catch (error) {
      return error as ApiError;
    }
    throw new Error('request should have failed');
  }

  it('maps a validation ProblemDetail to field errors', async () => {
    const error = await failWith(
      {
        type: 'https://punch-list/errors/validation',
        title: 'Invalid request',
        status: 400,
        detail: 'One or more fields are invalid',
        errors: [
          { field: 'numberContract', message: 'must not be blank' },
          { field: 'address', message: 'size must be between 0 and 255' },
        ],
      },
      400,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(400);
    expect(error.detail).toBe('One or more fields are invalid');
    expect(error.fieldErrors).toEqual({
      numberContract: 'must not be blank',
      address: 'size must be between 0 and 255',
    });
  });

  it('keeps the detail of a 404 and 422', async () => {
    expect(
      (await failWith({ title: 'Not found', status: 404, detail: 'Contract 9 not found' }, 404))
        .detail,
    ).toBe('Contract 9 not found');
    const rule = await failWith(
      { title: 'Business rule', status: 422, detail: 'OPEN requires registeredTo' },
      422,
    );
    expect(rule.status).toBe(422);
    expect(rule.title).toBe('Business rule');
  });

  it('never surfaces a non-ProblemDetail body (e.g. HTML error page)', async () => {
    const error = await failWith('<html>java.lang.NullPointerException at ...</html>', 500);

    expect(error.status).toBe(500);
    expect(error.detail).toBe('Something went wrong. Please try again.');
    expect(error.detail).not.toContain('Exception');
  });

  it('explains gateway errors (API down behind the proxy)', async () => {
    const error = await failWith('Bad Gateway', 502);
    expect(error.detail).toBe('The server is unavailable. Try again in a moment.');
  });

  it('reports network failures (status 0) with a friendly message', async () => {
    const result = firstValueFrom(http.get('/api/v1/contract'));
    httpTesting.expectOne('/api/v1/contract').error(new ProgressEvent('error'));
    await expect(result).rejects.toMatchObject({
      status: 0,
      detail: expect.stringContaining('reach the server'),
    });
  });

  it('wraps unknown values', () => {
    expect(toApiError('boom')).toBeInstanceOf(ApiError);
  });
});
